import React, { useEffect, useState } from "react";
import { VolumeIcon as VolumeUp, Plus } from "lucide-react";
import wordAPI from "../../api/wordAPI";

interface Example {
  japanese: string;
  reading: string;
  vietnamese: string;
}

interface Meaning {
  type: string;
  content: string;
  examples: Example[];
}

interface WordDetails {
  japanese: string;
  reading: string;
  romaji: string;
  meanings: Meaning[];
  note: string;
}

interface DetailWordProps {
  wordId: string | null;
}

const DetailWord: React.FC<DetailWordProps> = ({ wordId }) => {
  const [wordDetails, setWordDetails] = useState<WordDetails | null>(null);

  useEffect(() => {
    const fetchWordDetails = async () => {
      if (!wordId) return;
      try {
        const response = await wordAPI.getWord(wordId);
        const data = response.data.data;

        const mapped: WordDetails = {
          japanese: data.text,
          reading: data.hiragana?.[0] || "",
          romaji: data.romanji?.[0] || "",
          meanings: data.meaning.map((m: any) => ({
            type: m.type,
            content: m.content,
            examples: data.examples.map((ex: any) => ({
              japanese: ex.text || ex.example || "",
              reading: ex.hiragana || "",
              vietnamese: ex.meaning || ex.translation || "",
            })),
          })),
          note: data.meaning.map((m: any) => m.type).join(", "),
        };

        setWordDetails(mapped);
      } catch (err) {
        console.error("Lỗi khi gọi API getWord:", err);
      }
    };

    fetchWordDetails();
  }, [wordId]);

  if (!wordDetails) return null;

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <h1 className="text-4xl text-blue-600 font-bold mr-3">
          {wordDetails.japanese}
        </h1>
        <button className="p-1 text-gray-500 hover:bg-gray-100 rounded-full">
          <VolumeUp size={20} />
        </button>
        <div className="flex-grow"></div>
        <div className="flex gap-2">
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-lg">
          {wordDetails.reading} 「{wordDetails.romaji}」
        </p>
      </div>

      <div className="bg-amber-50 p-3 rounded-md border border-amber-200 mb-6">
        <p className="text-amber-800">⭐ {wordDetails.note}</p>
      </div>

      {wordDetails.meanings.map((meaning, index) => (
        <div key={index} className="mb-6">
          <h3 className="text-blue-700 text-lg mb-2">{meaning.content}</h3>

          {meaning.examples.map((example, exIndex) => (
            <div key={exIndex} className="mb-4 border-b pb-4">
              <div className="flex items-center mb-1">
                <p className="font-medium">{example.japanese}</p>
                <button className="ml-2 p-1 text-gray-500 hover:bg-gray-100 rounded-full">
                  <VolumeUp size={16} />
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-1">{example.reading}</p>
              <p className="text-gray-700">{example.vietnamese}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DetailWord;
