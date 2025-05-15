import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import wordAPI from "../../api/wordAPI";
import KanjiStrokeAnimator from "../kanji-stroke";

interface WordEntry {
  _id: string;
  text: string;
  hiragana: string;
  meaning: string;
}

interface KanjiEntry {
  _id: string;
  text: string;
  phonetic: string[];
  onyomi: string[];
  kunyomi: string[];
  strokes: number;
  meaning: string;
  romanji: string[];
}

interface WordSearchResult {
  mainWord: WordEntry;
  relatedWords: WordEntry[];
}

interface Props {
  searchText: string;
  onSelectWord: (id: string | null) => void;
}

const SearchResult: React.FC<Props> = ({ searchText, onSelectWord }) => {
  const [searchResult, setSearchResult] = useState<WordSearchResult | null>(
    null
  );
  const [kanjiList, setKanjiList] = useState<KanjiEntry[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchSearchResult = async () => {
      try {
        const response = await wordAPI.search(searchText);
        const data: WordEntry[] = response.data.data;

        if (data.length > 0) {
          setSearchResult({
            mainWord: data[0],
            relatedWords: data.slice(1),
          });
          onSelectWord(data[0]._id);
        } else {
          setSearchResult(null);
          onSelectWord(null);
        }
      } catch (error) {
        console.error("Lỗi khi tìm kiếm từ:", error);
        setSearchResult(null);
        onSelectWord(null);
      }
    };

    if (searchText) {
      fetchSearchResult();
    } else {
      setSearchResult(null);
      onSelectWord(null);
    }
  }, [searchText, onSelectWord]);

  useEffect(() => {
    const fetchKanji = async () => {
      if (!searchResult) {
        setKanjiList([]);
        return;
      }
      try {
        const res = await wordAPI.getWord(searchResult.mainWord._id);
        setKanjiList(res.data.data.kanji || []);
      } catch {
        setKanjiList([]);
      }
    };
    fetchKanji();
  }, [searchResult]);

  if (!searchResult) {
    return (
      <div className="h-full w-full p-4 rounded-2xl bg-white">
        <h2 className="text-lg font-medium mb-3">Không tìm thấy từ nào</h2>
      </div>
    );
  }

  const handleWordClick = (text: string) => {
    navigate(`?text=${encodeURIComponent(text)}`);
  };

  return (
    <div className="h-full p-4">
      {/* Từ chính */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-medium mb-3">Kết quả tra cứu</h2>
        <div className="p-2 rounded cursor-pointer hover:bg-blue-100">
          <div className="text-blue-600 text-lg font-medium">
            {searchResult.mainWord.text}
          </div>
          <div className="text-sm text-gray-600">
            {searchResult.mainWord.hiragana}
          </div>
          <div className="text-sm">{searchResult.mainWord.meaning}</div>
        </div>
      </div>

      {/* Từ liên quan */}
      {searchResult.relatedWords.length > 0 && (
        <div>
          <h2 className="text-lg font-medium mb-3">Các từ liên quan</h2>
          <div className="divide-y">
            {searchResult.relatedWords.map((word) => (
              <div
                key={word._id}
                className="py-3 cursor-pointer hover:bg-gray-100"
                onClick={() => handleWordClick(word.text)}
              >
                <div className="text-blue-600 font-medium">{word.text}</div>
                <div className="text-sm text-gray-600">{word.hiragana}</div>
                <div className="text-sm">{word.meaning}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Danh sách Kanji */}
      {kanjiList.length > 0 && (
        <div>
          <h2 className="text-lg font-medium mb-3">Các chữ Kanji</h2>
          <div className="space-y-4">
            {kanjiList.map((k) => (
              <details
                key={k._id}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >
                <summary className="cursor-pointer text-lg font-semibold">
                  {k.text} 「{k.onyomi.join(", ")}」
                  <p>{k.phonetic.join(", ")}</p>
                </summary>
                <div className="mt-2">
                  <div className="flex justify-center mb-4">
                    <KanjiStrokeAnimator char={k.text} />
                  </div>
                  <p>
                    <strong>Hán Việt:</strong> {k.phonetic.join(", ")}
                  </p>
                  <p>
                    <strong>Kun:</strong> {k.kunyomi.join(", ")}
                  </p>
                  <p>
                    <strong>On:</strong> {k.onyomi.join(", ")}
                  </p>
                  <p>
                    <strong>Số nét:</strong> {k.strokes}
                  </p>
                  <p className="mt-2">{k.meaning}</p>
                  <button
                    className="mt-2 text-sm text-blue-600 hover:underline"
                    onClick={() =>
                      navigate(
                        `/lookup/kanji/result?text=${encodeURIComponent(
                          k.text
                        )}`,
                        { state: { kanji: k } }
                      )
                    }
                  >
                    Xem chi tiết
                  </button>
                </div>
              </details>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResult;
