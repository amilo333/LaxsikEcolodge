import { createOpenAIChatReply } from "../service/openai-chat.js";
import { detectChatLanguage } from "../utils/chat-language.js";

const buckets = new Map();
const RATE_LIMIT = 15;
const RATE_WINDOW_MS = 60_000;

const isRateLimited = (key) => {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now - bucket.startedAt >= RATE_WINDOW_MS) {
    buckets.set(key, { count: 1, startedAt: now });
    return false;
  }

  bucket.count += 1;
  return bucket.count > RATE_LIMIT;
};

const getFallbackReply = (message, language) => {
  const normalized = message.toLowerCase();

  if (/xin chào|chào|hello|hi\b/.test(normalized)) {
    return language === "vi"
      ? "Xin chào! Tôi là trợ lý của Laxsik Ecolodge. Bạn muốn tìm phòng, xem giá hay cần hỗ trợ về kỳ nghỉ tại Sa Pa?"
      : "Hello! I am the Laxsik Ecolodge assistant. Would you like to find a room, check prices or plan your stay in Sa Pa?";
  }

  if (/phòng|room|giá|price|đặt/.test(normalized)) {
    return language === "vi"
      ? "Bạn hãy cho tôi biết ngày nhận phòng, ngày trả phòng, số khách và số phòng cần đặt. Bạn cũng có thể dùng phần tìm kiếm phòng để kiểm tra trực tiếp."
      : "Please share your check-in date, check-out date, number of guests and rooms. You can also use the room search to check directly.";
  }

  return language === "vi"
    ? "Tôi đã nhận được câu hỏi của bạn. Bạn có thể hỏi về phòng hoặc cung cấp ngày nhận và trả phòng để bắt đầu tìm kiếm."
    : "I received your question. You can ask about rooms or provide check-in and check-out dates to start a search.";
};

const normalizeMessages = (messages) =>
  messages
    .filter(
      (message) =>
        ["user", "assistant"].includes(message?.role) &&
        typeof message?.content === "string" &&
        message.content.trim(),
    )
    .slice(-12)
    .map((message) => ({
      role: message.role,
      content: message.content.trim().slice(0, 2_000),
    }));

export const createChatResponse = async (req, res) => {
  const preferredLanguage = req.body?.locale === "vi" ? "vi" : "en";
  let responseLanguage = preferredLanguage;

  try {
    if (isRateLimited(req.ip || "anonymous")) {
      return res.status(429).json({
        message:
          preferredLanguage === "vi"
            ? "Bạn gửi tin nhắn quá nhanh. Vui lòng thử lại sau một phút."
            : "You are sending messages too quickly. Please try again in one minute.",
      });
    }

    if (!Array.isArray(req.body.messages)) {
      return res.status(400).json({ message: "Messages must be an array." });
    }

    const messages = normalizeMessages(req.body.messages);
    const lastMessage = messages.at(-1);

    if (!lastMessage || lastMessage.role !== "user") {
      return res.status(400).json({
        message: "The last valid message must be from the user.",
      });
    }

    responseLanguage = detectChatLanguage(
      lastMessage.content,
      preferredLanguage,
    );

    if (!process.env.OPENAI_API_KEY) {
      return res.status(200).json({
        data: {
          message: getFallbackReply(lastMessage.content, responseLanguage),
          mode: "fallback",
          model: null,
          toolsUsed: [],
          rooms: [],
        },
      });
    }

    const reply = await createOpenAIChatReply(messages, {
      language: responseLanguage,
    });

    return res.status(200).json({
      data: { ...reply, mode: "openai" },
    });
  } catch (error) {
    console.error("Chat error:", error.message);

    if (error.status === 401) {
      return res.status(401).json({
        code: "OPENAI_AUTH_ERROR",
        message:
          responseLanguage === "vi"
            ? "Chatbot chưa được cấu hình đúng. Vui lòng thử lại sau."
            : "The chatbot is not configured correctly. Please try again later.",
      });
    }

    if (error.status === 429) {
      return res.status(429).json({
        code: "OPENAI_QUOTA_EXCEEDED",
        message:
          responseLanguage === "vi"
            ? "Chatbot đang tạm hết hạn mức. Vui lòng thử lại sau."
            : "The chatbot has temporarily reached its usage limit. Please try again later.",
      });
    }

    return res.status(502).json({
      code: "CHAT_SERVICE_ERROR",
      message:
        responseLanguage === "vi"
          ? "Chatbot đang tạm thời gián đoạn. Vui lòng thử lại sau."
          : "The chatbot is temporarily unavailable. Please try again later.",
    });
  }
};
