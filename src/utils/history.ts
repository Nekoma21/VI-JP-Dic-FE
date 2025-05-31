const KEYWORD_HISTORY_KEY = "keywordHistory";

// Lấy mảng lịch sử từ localStorage
export function getLocalKeywordHistory(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEYWORD_HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

// Lưu một keyword mới vào đầu mảng, giới hạn tối đa 50 mục
export function saveLocalKeywordHistory(keyword: string) {
  if (typeof window === "undefined") return;

  const existing: string[] = getLocalKeywordHistory();

  // Bỏ trùng và thêm vào đầu
  const deduped = [keyword, ...existing.filter((item) => item !== keyword)];

  // Giới hạn 50 mục
  if (deduped.length > 50) deduped.splice(50);

  localStorage.setItem(KEYWORD_HISTORY_KEY, JSON.stringify(deduped));
}
