const VIETNAMESE_WORDS = new Set([
  "ai",
  "ban",
  "bao",
  "bạn",
  "can",
  "cần",
  "cho",
  "co",
  "có",
  "cua",
  "của",
  "dat",
  "đặt",
  "den",
  "đến",
  "duoc",
  "được",
  "gia",
  "giá",
  "gio",
  "giờ",
  "hoi",
  "hỏi",
  "khach",
  "khách",
  "khong",
  "không",
  "la",
  "là",
  "may",
  "mấy",
  "minh",
  "mình",
  "muon",
  "muốn",
  "ngay",
  "ngày",
  "nhieu",
  "nhiêu",
  "o",
  "ở",
  "phong",
  "phòng",
  "sao",
  "toi",
  "tôi",
  "tu",
  "từ",
  "va",
  "và",
  "ve",
  "về",
  "voi",
  "với",
  "xem",
  "xin",
]);

const ENGLISH_WORDS = new Set([
  "available",
  "book",
  "booking",
  "can",
  "could",
  "day",
  "do",
  "does",
  "english",
  "for",
  "from",
  "guest",
  "hello",
  "hi",
  "how",
  "i",
  "is",
  "need",
  "night",
  "price",
  "room",
  "thanks",
  "the",
  "to",
  "want",
  "what",
  "when",
  "where",
  "which",
  "with",
  "you",
]);

export const detectChatLanguage = (text, fallback = "en") => {
  const normalized = String(text || "").toLowerCase();
  if (
    /[ăâđêôơưáàảãạấầẩẫậắằẳẵặéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]/i.test(
      normalized,
    )
  ) {
    return "vi";
  }

  const words = normalized.match(/\p{L}+/gu) || [];
  const vietnameseScore = words.reduce(
    (score, word) => score + Number(VIETNAMESE_WORDS.has(word)),
    0,
  );
  const englishScore = words.reduce(
    (score, word) => score + Number(ENGLISH_WORDS.has(word)),
    0,
  );

  if (vietnameseScore > englishScore) return "vi";
  if (englishScore > vietnameseScore) return "en";
  return fallback === "vi" ? "vi" : "en";
};
