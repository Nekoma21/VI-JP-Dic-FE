import type React from "react";
import { useState, useRef, useEffect } from "react";
import type { Deck, CardE } from "../../types/deck";
import cardAPI from "../../api/cardAPI";
import deckAPI from "../../api/deckAPI";
import {
  Settings,
  Edit,
  PlusCircle,
  MoreHorizontal,
  Trash2,
  X,
  ChevronDown,
} from "lucide-react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

interface DeckListProps {
  decks: Deck[];
  heatmap: { date: string; count: number }[];
  onDeckClick: (deck: Deck) => void;
  onRenameDeck: (deckId: string, newName: string) => void;
  onUpdateCard: (deckId: string, total: number, news: number) => void;
  onDelete: () => void;
}

const DeckList: React.FC<DeckListProps> = ({
  decks,
  heatmap,
  onDeckClick,
  onRenameDeck,
  onUpdateCard,
  onDelete,
}) => {
  const [openSettingsId, setOpenSettingsId] = useState<string | null>(null);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [currentDeck, setCurrentDeck] = useState<Deck | null>(null);
  const [newDeckName, setNewDeckName] = useState("");
  const [selectedDeckId, setSelectedDeckId] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [newCard, setNewCard] = useState({
    vocabulary: "",
    example: "",
    reading: "",
    meaning: "",
  });

  const handleSettingsClick = (e: React.MouseEvent, deckId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenSettingsId(openSettingsId === deckId ? null : deckId);
  };

  const handleOptionClick = (
    e: React.MouseEvent,
    action: string,
    deck: Deck
  ) => {
    e.stopPropagation();
    setOpenSettingsId(null);

    if (action === "rename") {
      setCurrentDeck(deck);
      setNewDeckName(deck.name);
      setIsRenameModalOpen(true);
    } else if (action === "add-card") {
      setCurrentDeck(deck);
      setSelectedDeckId(deck.id);
      setIsAddCardModalOpen(true);
      setNewCard({
        vocabulary: "",
        example: "",
        reading: "",
        meaning: "",
      });
    } else if (action === "delete") {
      setCurrentDeck(deck);
      handleDeleteDeck(deck.id);
    }
  };
  const handleDeleteDeck = async (id: string) => {
    await deckAPI.deleteDeck(id);
    onDelete();
  };

  const handleClickOutside = () => {
    setOpenSettingsId(null);
  };

  useEffect(() => {
    function handleClickOutsideDropdown(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutsideDropdown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideDropdown);
    };
  }, []);

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentDeck && newDeckName.trim()) {
      await deckAPI.updateDeck(currentDeck.id, newDeckName);

      onRenameDeck(currentDeck.id, newDeckName);

      setIsRenameModalOpen(false);
      setCurrentDeck(null);
    }
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedDeck = decks.find((deck) => deck.id === selectedDeckId);
    if (selectedDeck && newCard.vocabulary.trim() && newCard.meaning.trim()) {
      const card: CardE = {
        word: newCard.vocabulary,
        meaning: newCard.meaning,
        sentence: newCard.example,
        reading: newCard.reading,
      };

      await cardAPI.addCard(selectedDeckId, card);

      onUpdateCard(
        selectedDeckId,
        (selectedDeck.total += 1),
        selectedDeck.new < 25 ? (selectedDeck.new += 1) : selectedDeck.new
      );

      setIsAddCardModalOpen(false);
    }
  };

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCard((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (isRenameModalOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isRenameModalOpen]);

  return (
    <>
      <div className="bg-white rounded-3xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4 pb-2 border-b">
          <div className="text-xl font-medium text-[#000000]">Deck</div>
          <div className="flex items-center">
            <div className="text-xl font-medium text-[#000000] w-20 text-center">
              New
            </div>
            <div className="text-xl font-medium text-[#000000] w-20 text-center">
              Learn
            </div>
            <div className="text-xl font-medium text-[#000000] w-20 text-center">
              Due
            </div>
            <div className="w-10"></div>
          </div>
        </div>

        <div className="space-y-6">
          {decks.map((deck) => (
            <div
              key={deck.id}
              className="flex justify-between items-center cursor-pointer hover:bg-[#dfeaf2] p-2 rounded-lg transition-colors relative"
              onClick={() => onDeckClick(deck)}
            >
              <div>
                <div className="text-lg font-medium">{deck.name}</div>
                <div className="text-sm text-[#656565]">{deck.total} thẻ</div>
              </div>

              <div className="flex items-center">
                <div className="text-lg font-medium text-[#2d60ff] w-20 text-center">
                  {deck.new}
                </div>
                <div className="text-lg font-medium text-[#ff0302] w-20 text-center">
                  {deck.learn}
                </div>
                <div className="text-lg font-medium text-[#5ab055] w-20 text-center">
                  {deck.due}
                </div>

                <div className="relative">
                  <button
                    className="ml-2 p-2 rounded-full hover:bg-gray-200"
                    onClick={(e) => handleSettingsClick(e, deck.id)}
                  >
                    <Settings size={18} className="text-gray-600" />
                  </button>

                  {openSettingsId === deck.id && (
                    <>
                      <div className="fixed inset-0 z-10"></div>

                      <div className="absolute right-0 top-full mt-1 z-20 bg-white rounded-lg shadow-lg py-2 w-40">
                        <button
                          className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
                          onClick={(e) => handleOptionClick(e, "rename", deck)}
                        >
                          <Edit size={16} className="mr-2" />
                          <span>Rename</span>
                        </button>
                        <button
                          className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
                          onClick={(e) =>
                            handleOptionClick(e, "add-card", deck)
                          }
                        >
                          <PlusCircle size={16} className="mr-2" />
                          <span>Add card</span>
                        </button>
                        <button
                          className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
                          onClick={(e) =>
                            handleOptionClick(e, "optional", deck)
                          }
                        >
                          <MoreHorizontal size={16} className="mr-2" />
                          <span>Optional</span>
                        </button>
                        <button
                          className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100 text-red-500"
                          onClick={(e) => handleOptionClick(e, "delete", deck)}
                        >
                          <Trash2 size={16} className="mr-2" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {isRenameModalOpen && currentDeck && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-30 flex items-center justify-center"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
              onClick={() => setIsRenameModalOpen(false)}
            >
              <div
                className="bg-white rounded-xl p-6 w-96 shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-medium">Đổi tên Deck</h3>
                  <button
                    className="p-1 rounded-full hover:bg-gray-100"
                    onClick={() => setIsRenameModalOpen(false)}
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleRename}>
                  <div className="mb-4">
                    <label
                      htmlFor="deckName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Tên mới
                    </label>
                    <input
                      ref={inputRef}
                      type="text"
                      id="deckName"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d60ff] focus:border-transparent"
                      value={newDeckName}
                      onChange={(e) => setNewDeckName(e.target.value)}
                      placeholder="Nhập tên mới cho Deck"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                      onClick={() => setIsRenameModalOpen(false)}
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#2d60ff] text-white rounded-md hover:bg-[#2050e0]"
                      disabled={!newDeckName.trim()}
                    >
                      Lưu
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}

        {isAddCardModalOpen && (
          <>
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
                  <div className="mb-6 relative" ref={dropdownRef}>
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
                    <div>
                      <input
                        type="text"
                        name="vocabulary"
                        className="w-full p-3 border-b border-gray-300 focus:outline-none focus:border-[#2d60ff]"
                        placeholder="Từ vựng"
                        value={newCard.vocabulary}
                        onChange={handleCardInputChange}
                      />
                    </div>

                    <div>
                      <input
                        type="text"
                        name="example"
                        className="w-full p-3 border-b border-gray-300 focus:outline-none focus:border-[#2d60ff]"
                        placeholder="Câu ví dụ"
                        value={newCard.example}
                        onChange={handleCardInputChange}
                      />
                    </div>

                    <div>
                      <input
                        type="text"
                        name="reading"
                        className="w-full p-3 border-b border-gray-300 focus:outline-none focus:border-[#2d60ff]"
                        placeholder="Cách đọc"
                        value={newCard.reading}
                        onChange={handleCardInputChange}
                      />
                    </div>

                    <div>
                      <input
                        type="text"
                        name="meaning"
                        className="w-full p-3 border-b border-gray-300 focus:outline-none focus:border-[#2d60ff]"
                        placeholder="Ý nghĩa"
                        value={newCard.meaning}
                        onChange={handleCardInputChange}
                      />
                    </div>
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
          </>
        )}

        {openSettingsId && (
          <div
            className="fixed inset-0 z-10"
            onClick={(e) => {
              e.stopPropagation();
              handleClickOutside();
            }}
          ></div>
        )}
      </div>
      <div className="mt-8">
        <CalendarHeatmap
          startDate={new Date(new Date().getFullYear(), 0, 1)}
          endDate={new Date(new Date().getFullYear(), 11, 31)}
          values={heatmap}
          classForValue={(value) => {
            if (
              !value ||
              typeof value.count !== "number" ||
              value.count === 0
            ) {
              return "color-empty";
            }

            const count = Math.min(value.count, 20);
            const bucket = Math.ceil(count / 5);
            return `color-scale-${bucket}`;
          }}
          titleForValue={(value) =>
            value && value.date ? `${value.date}: ${value.count} thẻ` : ""
          }
          showWeekdayLabels
        />
      </div>
    </>
  );
};

export default DeckList;
