import React, { useEffect, useState } from "react";
import { Volume2, CirclePlus, ChevronDown } from "lucide-react";
import wordAPI from "../../api/wordAPI";
import cardAPI from "../../api/cardAPI";
import deckAPI from "../../api/deckAPI";
import type { Deck, CardE } from "../../types/deck";
import { toast } from "react-toastify";
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
  const [error, setError] = useState<string | null>(null);
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedDeckId, setSelectedDeckId] = useState<string>("");
  const [decks, setDecks] = useState<Deck[]>([]);
  const [newCard, setNewCard] = useState({
    vocabulary: "",
    example: "",
    reading: "",
    meaning: "",
  });

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const res = await deckAPI.getDeckOverview();
        setDecks(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy decks:", err);
      }
    };

    if (isAddCardModalOpen) {
      fetchDecks();
    }
  }, [isAddCardModalOpen]);

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCard((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const card: CardE = {
        word: newCard.vocabulary,
        meaning: newCard.meaning,
        sentence: newCard.example,
        reading: newCard.reading,
      };
      await cardAPI.addCard(selectedDeckId, card);
      setIsAddCardModalOpen(false);
      toast.success("Thhêm thẻ thành công!");
    } catch (error) {
      console.error("Lỗi khi tạo thẻ:", error);
    }
  };

  const handleOpenAddCardModal = () => {
    setIsAddCardModalOpen(true);
  };
  const playPronunciation = (text: string) => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    window.speechSynthesis.speak(utterance);
  };
  useEffect(() => {
    const fetchWordDetails = async () => {
      if (!wordId) {
        setWordDetails(null);
        setError("Không tìm thấy từ nào");
        return;
      }
      setError(null);
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
        setNewCard({
          vocabulary: data.text,
          example:
            data.examples?.[0]?.text || data.examples?.[0]?.example || "",
          reading: data.hiragana?.[0],
          meaning: data.meaning?.[0]?.content || "",
        });
      } catch (err) {
        console.error("Lỗi khi gọi API getWord:", err);
        setWordDetails(null);
        setError("Lỗi khi tải chi tiết từ");
      }
    };

    fetchWordDetails();
  }, [wordId]);

  if (error) {
    return (
      <div className="h-full w-full p-4 rounded-2xl bg-white">
        <h2 className="text-lg font-medium text-gray-600">{error}</h2>
      </div>
    );
  }

  if (!wordDetails) return null;

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <h1 className="text-4xl text-blue-600 font-bold mr-3">
          {wordDetails.japanese}
        </h1>
        <button
          className="p-1 text-gray-500 hover:bg-gray-100 rounded-full"
          onClick={() => playPronunciation(wordDetails.japanese)}
        >
          <Volume2 size={20} />
        </button>
        <div className="flex-grow"></div>
        <div className="flex gap-2">
          <button
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
            onClick={handleOpenAddCardModal}
          >
            <CirclePlus size={20} />
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
                <button
                  className="ml-2 p-1 text-gray-500 hover:bg-gray-100 rounded-full"
                  onClick={() => playPronunciation(example.japanese)}
                >
                  <Volume2 size={16} />
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-1">{example.reading}</p>
              <p className="text-gray-700">{example.vietnamese}</p>
            </div>
          ))}
        </div>
      ))}

      {isAddCardModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
          onClick={() => setIsAddCardModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl p-6 w-[500px] shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-6">Create New card</h3>

            <form onSubmit={handleAddCard}>
              <div className="mb-6 relative">
                <div
                  className="flex items-center justify-between w-full p-3 border border-gray-300 rounded-lg cursor-pointer"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-[#2d60ff] rounded mr-2"></div>
                    <span>
                      {decks.find((d) => d.id === selectedDeckId)?.name ||
                        "Select Deck"}
                    </span>
                  </div>
                  <ChevronDown size={20} />
                </div>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {decks.map((deck) => (
                      <div
                        key={deck.id}
                        className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSelectedDeckId(deck.id);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <div className="w-4 h-4 bg-[#2d60ff] rounded mr-2"></div>
                        <span>{deck.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  name="vocabulary"
                  placeholder="Từ vựng"
                  value={newCard.vocabulary}
                  onChange={handleCardInputChange}
                  className="w-full p-3 border-b border-gray-300 focus:outline-none focus:border-[#2d60ff]"
                />
                <input
                  type="text"
                  name="example"
                  placeholder="Câu ví dụ"
                  value={newCard.example}
                  onChange={handleCardInputChange}
                  className="w-full p-3 border-b border-gray-300 focus:outline-none focus:border-[#2d60ff]"
                />
                <input
                  type="text"
                  name="reading"
                  placeholder="Cách đọc"
                  value={newCard.reading}
                  onChange={handleCardInputChange}
                  className="w-full p-3 border-b border-gray-300 focus:outline-none focus:border-[#2d60ff]"
                />
                <input
                  type="text"
                  name="meaning"
                  placeholder="Ý nghĩa"
                  value={newCard.meaning}
                  onChange={handleCardInputChange}
                  className="w-full p-3 border-b border-gray-300 focus:outline-none focus:border-[#2d60ff]"
                />
              </div>

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  className="px-8 py-3 bg-gray-100 rounded-lg hover:bg-gray-200"
                  onClick={() => setIsAddCardModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-[#5f65f6] text-white rounded-lg hover:bg-[#4a4fd0]"
                  disabled={
                    !newCard.vocabulary.trim() || !newCard.meaning.trim()
                  }
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailWord;
