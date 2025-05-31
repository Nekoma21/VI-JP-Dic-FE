import { useState, useMemo } from "react";
import type { Deck, Card as CardType, CardE } from "../../types/deck";
import { ArrowLeft, X, PenSquare } from "lucide-react";
import reviewAPI from "../../api/reviewAPI";
import cardAPI from "../../api/cardAPI";
import { endOfDay } from "date-fns";

interface FlashcardViewProps {
  deck: Deck;
  onBack: () => void;
}

const FlashcardView: React.FC<FlashcardViewProps> = ({ deck, onBack }) => {
  const [cards, setCards] = useState<CardType[]>([...deck.cards]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const [isEditCardModalOpen, setIsEditCardModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editCard, setEditCard] = useState({
    vocabulary: "",
    example: "",
    reading: "",
    meaning: "",
  });

  const { newCount, learnCount, dueCount } = useMemo(() => {
    let n = 0,
      l = 0,
      d = 0;
    const todayEnd = endOfDay(new Date());
    for (const c of cards) {
      switch (c.state) {
        case 0:
          n++;
          break;
        case 1:
          l++;
          break;
        case 3:
          l++;
          break;
        case 2:
          if (new Date(c.due) <= todayEnd) d++;
          break;
      }
    }
    return { newCount: n, learnCount: l, dueCount: d };
  }, [cards]);

  const currentCard = cards[currentIdx];

  const handleFlip = () => setShowAnswer((v) => !v);

  const handleBack = () => onBack();

  function mergeCards(
    learning: CardType[],
    review: CardType[],
    fresh: CardType[]
  ): CardType[] {
    const out: CardType[] = [];
    let l = 0,
      r = 0,
      n = 0;
    while (l < learning.length || r < review.length || n < fresh.length) {
      for (let i = 0; i < 5 && l < learning.length; i++) {
        out.push(learning[l++]);
      }
      for (let i = 0; i < 5 && r < review.length; i++) {
        out.push(review[r++]);
      }
      if (n < fresh.length) {
        out.push(fresh[n++]);
      }
    }
    return out;
  }

  const handleRating = async (rating: string) => {
    const { data: updated } = await reviewAPI.review(
      currentCard._id,
      deck.id,
      rating
    );

    const nextCards = cards
      .filter((c) => c._id !== updated.card._id)
      .concat(
        new Date(updated.card.due) <= endOfDay(new Date()) ? [updated.card] : []
      );

    const learning = nextCards.filter((c) => c.state === 1 || c.state === 3);
    const review = nextCards.filter(
      (c) => c.state === 2 && new Date(c.due) <= endOfDay(new Date())
    );
    const fresh = nextCards.filter((c) => c.state === 0);

    const merged = mergeCards(learning, review, fresh);

    setCards(merged);

    const nextIdx = currentIdx < merged.length - 1 ? currentIdx + 1 : 0;
    setShowAnswer(false);
    setCurrentIdx(nextIdx);
  };

  const handleEditCardInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setEditCard((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editCard.vocabulary.trim() && editCard.meaning.trim()) {
      const updatedCard: CardE = {
        word: editCard.vocabulary,
        meaning: editCard.meaning,
        sentence: editCard.example,
        reading: editCard.reading,
      };

      await cardAPI.updateCard(currentCard._id, updatedCard);

      setCards((prev) =>
        prev.map((c) =>
          c._id === currentCard._id ? { ...c, ...updatedCard } : c
        )
      );

      setIsEditCardModalOpen(false);
    }
  };

  const handleDeleteCard = async () => {
    const cardId = currentCard._id;
    await cardAPI.deleteCard(cardId);

    const remainingCards = cards.filter((c) => c._id !== cardId);
    setCards(remainingCards);
    setIsDeleteModalOpen(false);
    setShowAnswer(false);
    setCurrentIdx((prev) => (prev >= remainingCards.length ? 0 : prev));
  };

  if (!cards.length) {
    return (
      <div className="p-8 text-center text-gray-500">
        Không còn thẻ nào để học trong deck này.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-md p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={handleBack}
          className="mr-4 p-2 rounded-full hover:bg-[#dfeaf2]"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-medium">{deck.name}</h2>
      </div>

      <div className="flex-1 flex flex-col items-center">
        <div
          className="w-full h-[500px] bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col relative"
          onClick={handleFlip}
        >
          <div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditCard({
                  vocabulary: currentCard.word,
                  example: currentCard.sentence || "",
                  reading: currentCard.reading,
                  meaning: currentCard.meaning,
                });
                setIsEditCardModalOpen(true);
              }}
              className="absolute top-5 right-16 p-2 rounded-full hover:bg-gray-100"
            >
              <PenSquare size={24} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteModalOpen(true);
              }}
              className="absolute top-6 right-4 p-2 rounded-full bg-black text-white hover:bg-gray-800"
            >
              <X size={14} />
            </button>
          </div>

          {!showAnswer ? (
            <div className="flex-1 flex flex-col">
              <div className="flex-1 flex items-center justify-center">
                <div className="text-5xl font-bold text-[#2d60ff]">
                  {currentCard.word}
                </div>
              </div>
              <div className="flex flex-col items-center mb-8">
                <div className="flex justify-center space-x-8 mb-2">
                  <span className="text-xl font-bold text-[#2d60ff]">
                    {newCount}
                  </span>
                  <span className="text-xl font-bold text-[#ff0302]">
                    {learnCount}
                  </span>
                  <span className="text-xl font-bold text-[#2da771]">
                    {dueCount}
                  </span>
                </div>
                <button
                  className="bg-[#f1f5fd] text-black font-medium px-12 py-3 rounded-full hover:bg-[#dfeaf2]"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFlip();
                  }}
                >
                  Hiện đáp án
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="flex justify-center items-center py-10">
                <div className="text-5xl font-bold text-[#2d60ff]">
                  {currentCard.reading}
                </div>
              </div>
              <div className="border-t border-gray-200 w-full"></div>
              <div className="flex-1 flex flex-col justify-center space-y-6 px-6 py-8">
                <div className="flex items-center">
                  <div className="bg-[#f1f5fd] text-[#11865b] font-medium px-6 py-3 rounded-full mr-6 text-2xl">
                    例
                  </div>
                  <div className="text-2xl font-medium">
                    {currentCard.sentence || "例文がありません。"}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-[#f1f5fd] text-[#11865b] font-medium px-6 py-3 rounded-full mr-6 text-2xl">
                    意
                  </div>
                  <div className="text-2xl font-medium">
                    {currentCard.meaning}
                  </div>
                </div>
              </div>
              <div className="flex justify-center px-6 py-8 gap-2">
                {(["again", "hard", "good", "easy"] as const).map((r) => (
                  <div key={r} className="flex flex-col items-center">
                    <div className="text-gray-400 mb-2"></div>
                    <button
                      className="bg-[#f1f5fd] text-black font-medium px-8 py-3 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRating(r);
                      }}
                    >
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {isEditCardModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
          onClick={() => setIsEditCardModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl p-6 w-[500px] shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-6">Cập nhật thẻ</h3>

            <form onSubmit={handleEditCardSubmit}>
              <div className="space-y-4">
                <input
                  type="text"
                  name="vocabulary"
                  className="w-full p-3 border-b border-gray-300 focus:outline-none focus:border-[#2d60ff]"
                  placeholder="Từ vựng"
                  value={editCard.vocabulary}
                  onChange={handleEditCardInputChange}
                />
                <input
                  type="text"
                  name="example"
                  className="w-full p-3 border-b border-gray-300 focus:outline-none focus:border-[#2d60ff]"
                  placeholder="Câu ví dụ"
                  value={editCard.example}
                  onChange={handleEditCardInputChange}
                />
                <input
                  type="text"
                  name="reading"
                  className="w-full p-3 border-b border-gray-300 focus:outline-none focus:border-[#2d60ff]"
                  placeholder="Cách đọc"
                  value={editCard.reading}
                  onChange={handleEditCardInputChange}
                />
                <input
                  type="text"
                  name="meaning"
                  className="w-full p-3 border-b border-gray-300 focus:outline-none focus:border-[#2d60ff]"
                  placeholder="Ý nghĩa"
                  value={editCard.meaning}
                  onChange={handleEditCardInputChange}
                />
              </div>

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  className="px-8 py-3 bg-gray-100 rounded-lg hover:bg-gray-200"
                  onClick={() => setIsEditCardModalOpen(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-[#5f65f6] text-white rounded-lg hover:bg-[#4a4fd0]"
                  disabled={
                    !editCard.vocabulary.trim() || !editCard.meaning.trim()
                  }
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl p-6 w-[400px] shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4 text-red-600">
              Xác nhận xoá thẻ
            </h3>
            <p className="mb-6 text-gray-700">
              Bạn có chắc muốn xoá thẻ này không?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Huỷ
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleDeleteCard}
              >
                Xoá
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardView;
