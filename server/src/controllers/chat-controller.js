import { createOpenAIChatReply } from "../service/openai-chat.js";

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

const getFallbackReply = (message) => {
  const normalized = message.toLowerCase();

  if (/xin chào|chào|hello|hi\b/.test(normalized)) {
    return "Xin chào! Tôi là trợ lý của Laxsik Ecolodge. Bạn muốn tìm phòng, xem giá hay cần hỗ trợ về kỳ nghỉ tại Sa Pa?";
  }

  if (/phòng|room|giá|price|đặt/.test(normalized)) {
    return "Bạn hãy cho tôi biết ngày nhận phòng, ngày trả phòng, số khách và số phòng cần đặt. Bạn có thể dùng phần tìm kiếm phòng trên trang để kiểm tra dữ liệu trực tiếp từ hệ thống.";
  }

  return "Tôi đã nhận được câu hỏi của bạn. Chatbot hiện đang ở chế độ cơ bản; bạn có thể hỏi về phòng hoặc cung cấp ngày nhận/trả phòng để chuẩn bị tìm kiếm.";
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
  try {
    if (isRateLimited(req.ip || "anonymous")) {
      return res.status(429).json({
        message: "Bạn gửi tin nhắn quá nhanh. Vui lòng thử lại sau một phút.",
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

    if (!process.env.OPENAI_API_KEY) {
      return res.status(200).json({
        data: {
          message: getFallbackReply(lastMessage.content),
          mode: "fallback",
          model: null,
          toolsUsed: [],
          rooms: [],
        },
      });
    }

    const reply = await createOpenAIChatReply(messages);

    return res.status(200).json({
      data: { ...reply, mode: "openai" },
    });
  } catch (error) {
    console.error("Chat error:", error.message);

    if (error.status === 401) {
      return res.status(401).json({
        code: "OPENAI_AUTH_ERROR",
        message:
          "OpenAI API key không hợp lệ. Hãy kiểm tra OPENAI_API_KEY trong server/.env.",
      });
    }

    if (error.status === 429) {
      return res.status(429).json({
        code: "OPENAI_QUOTA_EXCEEDED",
        message:
          "Tài khoản OpenAI đã hết hạn mức hoặc chưa có số dư. Hãy nạp credit trong OpenAI Platform rồi thử lại.",
      });
    }

    return res.status(502).json({
      code: "CHAT_SERVICE_ERROR",
      message: "Chatbot đang tạm thời gián đoạn. Vui lòng thử lại sau.",
    });
  }
};
