// src/utils/translateHistory.ts
const TRANSLATION_HISTORY_KEY = "translationHistory";

export interface TranslationRecord {
  source: string;
  timestamp: string; // ISO string
}

/**
 * Lấy mảng lịch sử dịch từ localStorage
 */
export function getLocalTranslationHistory(): TranslationRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(
      localStorage.getItem(TRANSLATION_HISTORY_KEY) || "[]"
    ) as TranslationRecord[];
  } catch {
    return [];
  }
}

export function saveLocalTranslationHistory(record: TranslationRecord) {
  if (typeof window === "undefined") return;

  const existing = getLocalTranslationHistory();

  const deduped = [
    record,
    ...existing.filter((item) => !(item.source === record.source)),
  ];

  if (deduped.length > 50) deduped.splice(50);

  localStorage.setItem(TRANSLATION_HISTORY_KEY, JSON.stringify(deduped));
}
