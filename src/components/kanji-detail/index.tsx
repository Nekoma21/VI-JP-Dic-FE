import React, { useEffect, useRef, useState } from "react";
import HanziWriter from "hanzi-writer";
import compositionAPI from "../../api/compositionAPI";

type KanjiDetailProps = {
  kanji: {
    text: string;
    hanviet: string;
    kunyomi: string[];
    onyomi: string[];
    strokes: number;
    jlpt: string;
    radicals: string[];
    meaning: string;
  };
};

type CompositionInfo = {
  _id: string;
  raw_text: string;
  phonetic: string;
};

const KanjiDetail: React.FC<KanjiDetailProps> = ({ kanji }) => {
  const writerRef = useRef<HTMLDivElement>(null);
  const hanziInstance = useRef<HanziWriter | null>(null);
  const [radicalDetails, setRadicalDetails] = useState<CompositionInfo[]>([]);

  useEffect(() => {
    const fetchRadicals = async () => {
      if (!kanji.radicals || kanji.radicals.length === 0) {
        setRadicalDetails([]);
        return;
      }

      try {
        const results = await Promise.all(
          kanji.radicals.map((id) => compositionAPI.getById(id))
        );

        const compositions = results
          .map((res) => res?.data?.data)
          .filter((item): item is CompositionInfo => !!item);

        setRadicalDetails(compositions);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin bộ:", error);
      }
    };

    fetchRadicals();
  }, [kanji.radicals]);

  useEffect(() => {
    if (writerRef.current) {
      writerRef.current.innerHTML = "";
      hanziInstance.current = HanziWriter.create(
        writerRef.current,
        kanji.text,
        {
          width: 230,
          height: 230,
          strokeAnimationSpeed: 1,
          delayBetweenStrokes: 200,
          showOutline: true,
          strokeColor: "#2D60FF",
          radicalColor: "#16A34A",
        }
      );
      hanziInstance.current.animateCharacter();
    }
  }, [kanji.text]);

  const handleReplay = () => {
    hanziInstance.current?.animateCharacter();
  };

  return (
    <div>
      <div className="w-full bg-white border rounded-lg p-6 shadow-md">
        <h2 className="text-blue-600 text-2xl font-semibold mb-4">
          Chi tiết chữ kanji{" "}
          <strong className="text-blue-600">{kanji.text}</strong>
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="mb-6">
              <strong>Hán tự:</strong> {kanji.text} - {kanji.hanviet}
            </p>
            <p className="mb-6">
              <strong>Kunyomi:</strong> {kanji.kunyomi.join(", ")}
            </p>
            <p className="mb-6">
              <strong>Onyomi:</strong> {kanji.onyomi.join(", ")}
            </p>
            <p className="mb-6">
              <strong>Số nét:</strong> {kanji.strokes}
            </p>
            <p className="mb-6">
              <strong>JLPT:</strong> N{kanji.jlpt}
            </p>
            {radicalDetails.length > 0 && (
              <p className="mb-6">
                <strong>Bộ:</strong>{" "}
                {radicalDetails
                  .map((r) => `${r.raw_text} ${r.phonetic}`)
                  .join(", ")}
              </p>
            )}
          </div>

          <div className="flex flex-col items-center justify-center">
            <div ref={writerRef} className="mb-2" />
            <button
              onClick={handleReplay}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Phát lại
            </button>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-medium mb-1">Nghĩa</h3>
          <p className="text-gray-800 whitespace-pre-wrap">{kanji.meaning}</p>
        </div>
      </div>
    </div>
  );
};

export default KanjiDetail;
