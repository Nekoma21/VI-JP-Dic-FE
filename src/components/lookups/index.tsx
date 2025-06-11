"use client";

import type React from "react";

import { type FC, useState, useRef, useEffect } from "react";
import { ChevronDown, Clock } from "lucide-react";
import SearchIcon from "../../assets/icon/icon-search.svg";
import PenIcon from "../../assets/icon/icon-pen.svg";
import MicIcon from "../../assets/icon/icon-mic.svg";
import KanjiDrawingBoard from "../kanji-draw-board/index";
import {
  saveLocalKeywordHistory,
  getLocalKeywordHistory,
} from "../../utils/history";
import VoiceRecordingModal from "../../components/voice-modal";

import { useNavigate, useLocation } from "react-router-dom";

const LookupArea: FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("Nhật - Việt");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDrawingBoardOpen, setIsDrawingBoardOpen] = useState(false);
  const [isHistoryDropdownOpen, setIsHistoryDropdownOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState<string[]>([]);

  const boardRef = useRef<HTMLDivElement>(null);
  const voiceRef = useRef<HTMLDivElement>(null);
  const historyDropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [tempInputText, setTempInputText] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // Load history items on component mount
  useEffect(() => {
    setHistoryItems(getLocalKeywordHistory());
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setIsDropdownOpen(false);
  };

  const handleKanjiSelect = (kanji: string) => {
    setTempInputText((prevText) => `${prevText}${kanji}`);
  };

  const handleSearch = (searchText?: string) => {
    const textToSearch = searchText || tempInputText;
    if (!textToSearch.trim()) return;

    saveLocalKeywordHistory(textToSearch.trim());
    setHistoryItems(getLocalKeywordHistory()); // Update history items

    if (location.pathname === "/lookup/result") {
      navigate(`/lookup/result?text=${encodeURIComponent(textToSearch)}`, {
        replace: true,
      });
    } else {
      navigate(`/lookup/result?text=${encodeURIComponent(textToSearch)}`);
    }

    setIsHistoryDropdownOpen(false);
  };

  const handleHistoryItemClick = (keyword: string) => {
    setTempInputText(keyword);
    handleSearch(keyword);
  };

  const handleInputFocus = () => {
    if (historyItems.length > 0) {
      setIsHistoryDropdownOpen(true);
    }
  };

  const handleInputBlur = (e: React.FocusEvent) => {
    // Delay hiding dropdown to allow clicking on history items
    setTimeout(() => {
      if (!historyDropdownRef.current?.contains(e.relatedTarget as Node)) {
        setIsHistoryDropdownOpen(false);
      }
    }, 150);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryText = params.get("text") || "";
    setTempInputText(queryText);
  }, [location.search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        boardRef.current &&
        !boardRef.current.contains(event.target as Node)
      ) {
        setIsDrawingBoardOpen(false);
      }

      if (
        historyDropdownRef.current &&
        !historyDropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsHistoryDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm mb-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Language selector */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center justify-between w-full md:w-auto bg-[#2D60FF] text-white px-4 py-7 rounded-lg cursor-pointer hover:bg-[#2D60FF]/90 transition-colors"
          >
            <span>{selectedLanguage}</span>
            <ChevronDown className="w-5 h-5 ml-2" />
          </button>

          {/* Language Dropdown */}
          {isDropdownOpen && (
            <div
              className="absolute left-0 mt-1 md:w-auto bg-white border border-gray-200 rounded-lg shadow-lg z-10"
              style={{ width: "100%" }}
            >
              <ul className="py-2">
                <li
                  onClick={() => handleLanguageChange("Nhật - Việt")}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                    selectedLanguage === "Nhật - Việt" ? "bg-gray-100" : ""
                  }`}
                >
                  Nhật - Việt
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Search input */}
        <div className="flex-1 relative">
          <div className="flex items-center border border-gray-200 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
            <img
              src={SearchIcon || "/placeholder.svg"}
              className="w-6 h-6 text-gray-400 mr-2 cursor-pointer"
              onClick={() => handleSearch()}
            />
            <input
              ref={inputRef}
              type="text"
              placeholder="日本, nihon, Nhật Bản"
              className="flex-1 outline-none text-secondary"
              value={tempInputText}
              onChange={(e) => setTempInputText(e.target.value)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
                if (e.key === "Escape") {
                  setIsHistoryDropdownOpen(false);
                }
              }}
            />
            <div
              className="flex items-center space-x-3 px-3 py-3 rounded-xl"
              style={{ backgroundColor: "#F5F7FA" }}
            >
              <button
                className="cursor-pointer"
                onClick={() => setIsDrawingBoardOpen(true)}
              >
                <img src={PenIcon || "/placeholder.svg"} className="w-7 h-7" />
              </button>
              <button
                className="cursor-pointer"
                onClick={() => setIsVoiceModalOpen(true)}
              >
                <img src={MicIcon || "/placeholder.svg"} className="w-7 h-7" />
              </button>
            </div>
          </div>

          {/* History Dropdown */}
          {isHistoryDropdownOpen && historyItems.length > 0 && (
            <div
              ref={historyDropdownRef}
              className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto"
            >
              {historyItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => handleHistoryItemClick(item)}
                >
                  <Clock className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-xl font-medium text-gray-900">
                      {item}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Voice modal */}
      {isVoiceModalOpen && (
        <div ref={voiceRef}>
          <VoiceRecordingModal
            onClose={() => setIsVoiceModalOpen(false)}
            setInputText={setTempInputText}
          />
        </div>
      )}

      {/* Kanji Drawing Board */}
      {isDrawingBoardOpen && (
        <div className="mt-4 mr-10" style={{ width: "900%" }}>
          <div ref={boardRef} style={{ width: "33.4%" }}>
            <KanjiDrawingBoard onKanjiSelect={handleKanjiSelect} />
          </div>
        </div>
      )}
    </div>
  );
};

export default LookupArea;
