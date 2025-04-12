import { useState } from "react";
import { Clock, MessageSquare } from "lucide-react";
import PenIcon from "../../assets/icon/icon-pen.svg";
import MicIcon from "../../assets/icon/icon-mic.svg";
import ImageIcon from "../../assets/icon/icon-image.svg";

const TranslatePage = () => {
  const [sourceLanguage, setSourceLanguage] = useState("Japanese");
  const [targetLanguage, setTargetLanguage] = useState("Vietnamese");

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
  return (
    <div className="flex-1 bg-[#f5f7fa] p-6">
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
            ></textarea>

            <div className="flex items-center justify-between pb-2 pt-2 pl-4 pr-4 border-t border-[#dfeaf2]">
              <div className="flex items-center gap-4">
                <button className="cursor-pointer">
                  <img src={PenIcon} className="w-7 h-7" />
                </button>
                <button className="cursor-pointer">
                  <img src={MicIcon} className="w-7 h-7" />
                </button>
                <button className="cursor-pointer">
                  <img src={ImageIcon} className="w-7 h-7" />
                </button>
              </div>
              <div className="flex items-center justify-end p-4 border-[#dfeaf2]">
                <div className="text-[#a6a6a6] text-sm">0/5000</div>
                <button className="flex items-center gap-2 text-[#7e869e] hover:text-[#343c6a] bg-[#f1f1f1] px-3 py-1.5 rounded-md ml-4 cursor-pointer">
                  <MessageSquare className="w-4 h-4" />
                  <span>Dịch</span>
                </button>
              </div>
            </div>
          </div>
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
            <div className="w-full text-[#343c6a]" style={{ height: "274px" }}>
              {/* Translation result will appear here */}
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
    </div>
  );
};

export default TranslatePage;
