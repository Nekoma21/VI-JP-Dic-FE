import React, { useEffect, useState } from "react";
import wordAPI from "../../api/wordAPI";

interface WordEntry {
  _id: string;
  text: string;
  hiragana: string;
  meaning: string;
}

interface WordSearchResult {
  mainWord: WordEntry;
  relatedWords: WordEntry[];
}

interface Props {
  searchText: string;
  onSelectWord: (id: string) => void;
}

const SearchResult: React.FC<Props> = ({ searchText, onSelectWord }) => {
  const [searchResult, setSearchResult] = useState<WordSearchResult | null>(
    null
  );

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
        }
      } catch (error) {
        console.error("Lỗi khi tìm kiếm từ:", error);
      }
    };

    fetchSearchResult();
  }, [searchText]);

  if (!searchResult) {
    return (
      <div className="h-full w-full p-4 rounded-2xl bg-white">
        <h2 className="text-lg font-medium mb-3">Không tìm thấy từ nào</h2>
      </div>
    );
  }

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
              >
                <div className="text-blue-600 font-medium">{word.text}</div>
                <div className="text-sm text-gray-600">{word.hiragana}</div>
                <div className="text-sm">{word.meaning}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResult;
