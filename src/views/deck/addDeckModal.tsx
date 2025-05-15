import type React from "react";
import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";

interface AddDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDeck: (deckName: string) => void;
}

const AddDeckModal: React.FC<AddDeckModalProps> = ({
  isOpen,
  onClose,
  onAddDeck,
}) => {
  const [deckName, setDeckName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (deckName.trim()) {
      onAddDeck(deckName);
      setDeckName("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-30 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 w-96 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-medium">Tạo Deck mới</h3>
          <button
            className="p-1 rounded-full hover:bg-gray-100"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="newDeckName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tên Deck
            </label>
            <input
              ref={inputRef}
              type="text"
              id="newDeckName"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d60ff] focus:border-transparent"
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              placeholder="Nhập tên cho Deck mới"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#2d60ff] text-white rounded-md hover:bg-[#2050e0]"
              disabled={!deckName.trim()}
            >
              Tạo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDeckModal;
