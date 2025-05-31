import { type FC, useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import SearchIcon from "../../assets/icon/icon-search.svg";
import PenIcon from "../../assets/icon/icon-pen.svg";
import MicIcon from "../../assets/icon/icon-mic.svg";
import KanjiDrawingBoard from "../kanji-draw-board/index";
import { saveLocalKeywordHistory } from "../../utils/history";
import VoiceRecordingModal from "../../components/voice-modal";

import { useNavigate, useLocation } from "react-router-dom";

const LookupArea: FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("Nhật - Việt");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDrawingBoardOpen, setIsDrawingBoardOpen] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);

  const voiceRef = useRef<HTMLDivElement>(null);

  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  const [tempInputText, setTempInputText] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setIsDropdownOpen(false);
  };
  const handleKanjiSelect = (kanji: string) => {
    setTempInputText((prevText) => `${prevText}${kanji}`);
  };

  const handleSearch = () => {
    if (!tempInputText.trim()) return;

    saveLocalKeywordHistory(tempInputText.trim());

    if (location.pathname === "/lookup/result") {
      navigate(`/lookup/result?text=${encodeURIComponent(tempInputText)}`, {
        replace: true,
      });
    } else {
      navigate(`/lookup/result?text=${encodeURIComponent(tempInputText)}`);
    }
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
        setIsDrawingBoardOpen(false); // Đóng board
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

          {/* Dropdown */}
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
                {/* <li
                  onClick={() => handleLanguageChange("Việt - Nhật")}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                    selectedLanguage === "Việt - Nhật" ? "bg-gray-100" : ""
                  }`}
                >
                  Việt - Nhật
                </li> */}
              </ul>
            </div>
          )}
        </div>

        {/* Search input */}
        <div className="flex-1 relative">
          <div className="flex items-center border border-gray-200 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
            <img
              src={SearchIcon}
              className="w-6 h-6 text-gray-400 mr-2 cursor-pointer"
              onClick={handleSearch}
            />
            <input
              type="text"
              placeholder="日本, nihon, Nhật Bản"
              className="flex-1 outline-none text-secondary"
              value={tempInputText}
              onChange={(e) => setTempInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
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
                <img src={PenIcon} className="w-7 h-7" />
              </button>
              <button
                className="cursor-pointer"
                onClick={() => setIsVoiceModalOpen(true)}
              >
                <img src={MicIcon} className="w-7 h-7" />
              </button>
            </div>
          </div>
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
