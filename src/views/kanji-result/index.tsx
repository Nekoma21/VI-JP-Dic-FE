// src/pages/KanjiResult.tsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import LookupArea from "../../components/lookups";
import KanjiDetail from "../../components/kanji-detail";

type LocationState = {
  kanji?: {
    _id: string;
    text: string;
    phonetic: string[];
    onyomi: string[];
    kunyomi: string[];
    strokes: number;
    jlpt_level: string;
    composition: string[];
    meaning: string;
  };
};

const KanjiResult: React.FC = () => {
  const location = useLocation();
  const state = location.state as LocationState;

  const [kanjiData, setKanjiData] = useState<LocationState["kanji"] | null>(
    null
  );

  useEffect(() => {
    if (state?.kanji) {
      setKanjiData(state.kanji);
    } else {
      setKanjiData(null);
    }
  }, [state]);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 w-full h-full p-4 mb-8">
        <LookupArea />

        <div className="flex bg-gray-100">
          {/* Left panel */}
          <div className="w-80 border-r border-gray-200 bg-white rounded-2xl mr-4 p-4">
            <h2 className="text-lg font-medium mb-3">Kết quả tra cứu kanji</h2>
            <div className="p-2 rounded bg-blue-50">
              <div className="text-blue-600 text-lg font-medium">
                {kanjiData?.text || "Không có dữ liệu"}
              </div>
              <div className="text-lg font-medium">{kanjiData?.phonetic}</div>
            </div>
          </div>

          {/* Right panel */}
          <div className="flex-1 overflow-auto bg-white rounded-2xl p-6">
            {kanjiData ? (
              <KanjiDetail
                kanji={{
                  text: kanjiData.text,
                  hanviet: kanjiData.phonetic.join(", "),
                  kunyomi: kanjiData.kunyomi,
                  onyomi: kanjiData.onyomi,
                  strokes: kanjiData.strokes,
                  jlpt: kanjiData.jlpt_level,
                  radicals: kanjiData.composition,
                  meaning: kanjiData.meaning,
                }}
              />
            ) : (
              <div className="text-center text-gray-500">
                Không có thông tin chi tiết
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanjiResult;
