import { useState, useRef, useEffect } from "react";
import { Clock, MessageSquare } from "lucide-react";
import PenIcon from "../../assets/icon/icon-pen.svg";
import MicIcon from "../../assets/icon/icon-mic.svg";
import ImageIcon from "../../assets/icon/icon-image.svg";
import KanjiDrawingBoard from "../../components/kanji-draw-board/index";
import translateAPI from "../../api/translateAPI";
import LoadingOverlay from "../../components/loading-overlay";

const TranslatePage = () => {
  const [sourceLanguage, setSourceLanguage] = useState("Japanese");
  const [targetLanguage, setTargetLanguage] = useState("Vietnamese");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDrawingBoardOpen, setIsDrawingBoardOpen] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);

  const handleSourceLanguageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedLanguage = e.target.value;
    setSourceLanguage(selectedLanguage);
    setTargetLanguage(
      selectedLanguage === "Japanese" ? "Vietnamese" : "Japanese"
    );
  };

  const handleTargetLanguageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedLanguage = e.target.value;
    setTargetLanguage(selectedLanguage);
    setSourceLanguage(
      selectedLanguage === "Japanese" ? "Vietnamese" : "Japanese"
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        alert("Chỉ hỗ trợ upload file dạng ảnh (PNG, JPEG) hoặc PDF.");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Vui lòng chọn một file trước khi upload.");
      return;
    }

    try {
      setIsModalOpen(false);
      setLoading(true);
      const response = await translateAPI.detect(selectedFile);
      const detectedText = response.data.data.text || "";

      if (detectedText) {
        setInputText(detectedText);
      } else {
        alert("Không phát hiện được văn bản trong file.");
      }
    } catch (error) {
      console.error("Lỗi khi xử lý OCR:", error);
      alert("Không thể nhận dạng văn bản từ file.");
    } finally {
      setLoading(false);
    }
  };

  const handleKanjiSelect = (kanji: string) => {
    setInputText((prevText) => `${prevText}${kanji}`);
  };

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
    <div className="flex-1 bg-[#f5f7fa] p-6">
      <LoadingOverlay loading={loading} />
      {/* Translation Interface */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Source Language */}
        <div className="rounded-lg">
          <div className="p-4 mb-4 border-[#dfeaf2] rounded-2xl bg-white">
            <div className="relative inline-block w-full">
              <select
                value={sourceLanguage}
                onChange={handleSourceLanguageChange}
                className="appearance-none bg-white text-[#343c6a] font-medium py-2 pl-4 pr-10 rounded-md focus:outline-none w-full"
              >
                <option>Japanese</option>
                <option>Vietnamese</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#343c6a]">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="pb-2 pt-4 pl-4 pr-4 bg-white rounded-2xl">
            <textarea
              className="w-full h-48 resize-none border-0 focus:outline-none text-[#343c6a]"
              placeholder="Nhập văn bản để dịch..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            ></textarea>

            <div className="flex items-center justify-between pb-2 pt-2 pl-4 pr-4 border-t border-[#dfeaf2]">
              <div className="flex items-center gap-4">
                <button
                  className="cursor-pointer"
                  onClick={() => setIsDrawingBoardOpen(true)}
                >
                  <img src={PenIcon} className="w-7 h-7" />
                </button>
                <button className="cursor-pointer">
                  <img src={MicIcon} className="w-7 h-7" />
                </button>
                <button
                  className="cursor-pointer"
                  onClick={() => setIsModalOpen(true)}
                >
                  <img src={ImageIcon} className="w-7 h-7" />
                </button>
              </div>
              <div className="flex items-center justify-end p-4 border-[#dfeaf2]">
                <button
                  className="flex items-center gap-2 text-[#7e869e] hover:text-[#343c6a] bg-[#f1f1f1] px-3 py-1.5 rounded-md ml-4 cursor-pointer"
                  onClick={async () => {
                    if (!inputText.trim())
                      return alert("Vui lòng nhập văn bản.");
                    try {
                      setLoading(true);
                      const response = await translateAPI.translate(inputText);
                      setTranslatedText(
                        response.data.data.text || "Không có kết quả."
                      );
                    } catch (err) {
                      console.error("Lỗi dịch:", err);
                      alert("Lỗi khi gọi API dịch.");
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Dịch</span>
                </button>
              </div>
            </div>
          </div>
          {/* Kanji Drawing Board */}
          {isDrawingBoardOpen && (
            <div ref={boardRef} className="mt-4" style={{ width: "300%" }}>
              <KanjiDrawingBoard onKanjiSelect={handleKanjiSelect} />
            </div>
          )}
        </div>

        {/* Target Language */}
        <div className="rounded-lg">
          <div className="p-4 mb-4 rounded-2xl bg-[#2d60ff]">
            <div className="relative inline-block w-full">
              <select
                value={targetLanguage}
                onChange={handleTargetLanguageChange}
                className="appearance-none bg-[#2d60ff] text-white font-medium py-2 pl-4 pr-10 rounded-md focus:outline-none w-full"
              >
                <option>Japanese</option>
                <option>Vietnamese</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white rounded-2xl">
            <div
              className="w-full text-[#343c6a] whitespace-pre-wrap overflow-y-auto"
              style={{ height: "274px" }}
            >
              {translatedText || "Kết quả dịch sẽ hiển thị tại đây."}
            </div>
          </div>
        </div>
      </div>

      {/* History Section */}
      <div className="mb-6">
        <button className="bg-[#ffe000] text-[#343c6a] font-medium px-4 py-2 rounded-full flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5" />
          <span>Lịch sử</span>
        </button>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {[1, 2, 3].map((item, index) => (
            <div
              key={index}
              className="p-4 border-b border-[#dfeaf2] last:border-b-0"
            >
              <div className="flex items-center justify-between">
                <p className="text-[#343c6a] font-medium">
                  Hôm nay tôi muốn ăn gì
                </p>
                <div className="flex items-center gap-2 text-[#a6a6a6] text-sm">
                  <Clock className="w-4 h-4" />
                  <span>2025-03-30</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-100"
          style={{ backgroundColor: "#000000a3" }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-[500px] max-w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Upload File</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div
              className={`border-2 border-dashed rounded-lg p-8 mb-4 text-center ${
                selectedFile
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 hover:border-blue-500"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const file = e.dataTransfer.files?.[0];
                if (file) {
                  const allowedTypes = [
                    "image/png",
                    "image/jpeg",
                    "application/pdf",
                  ];
                  if (!allowedTypes.includes(file.type)) {
                    alert(
                      "Chỉ hỗ trợ upload file dạng ảnh (PNG, JPEG) hoặc PDF."
                    );
                    return;
                  }
                  setSelectedFile(file);
                }
              }}
            >
              {selectedFile ? (
                <div className="flex flex-col items-center">
                  <div className="mb-2 text-green-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="mt-3 text-sm text-red-500 hover:text-red-700"
                  >
                    Xóa file
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="mb-3 text-blue-500">
                    <label className="cursor-pointer mb-3 text-blue-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                      <input
                        type="file"
                        accept="image/png, image/jpeg, application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-sm font-medium mb-1">
                    Kéo thả file vào đây hoặc
                  </p>
                  <label className="cursor-pointer text-blue-500 hover:text-blue-700 text-sm font-medium">
                    Chọn file từ thiết bị
                    <input
                      type="file"
                      accept="image/png, image/jpeg, application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-3">
                    Hỗ trợ: PNG, JPEG, PDF (tối đa 10MB)
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                onClick={() => setIsModalOpen(false)}
              >
                Hủy
              </button>
              <button
                className={`px-4 py-2 bg-blue-500 text-white rounded-md transition-colors ${
                  selectedFile
                    ? "hover:bg-blue-600"
                    : "opacity-50 cursor-not-allowed"
                }`}
                onClick={handleUpload}
                disabled={!selectedFile}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TranslatePage;
