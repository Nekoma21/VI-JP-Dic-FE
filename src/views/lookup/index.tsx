import { useEffect, useState } from "react";
import LookupArea from "../../components/lookups/index";
import {
  getLocalKeywordHistory,
  saveLocalKeywordHistory,
} from "../../utils/history";
import { useNavigate } from "react-router-dom";

const LookUpPage = () => {
  const [historyItems, setHistoryItems] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setHistoryItems(getLocalKeywordHistory());
  }, []);

  const onHistoryClick = (keyword: string) => {
    saveLocalKeywordHistory(keyword);
    setHistoryItems(getLocalKeywordHistory());
    navigate(`/lookup/result?text=${encodeURIComponent(keyword)}`);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 w-full h-full p-4 bg-gray-100 dark:bg-gray-800 mb-8">
        <LookupArea />

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl text-secondary font-medium mb-6">Lịch sử</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {historyItems.length === 0 && (
              <p className="col-span-full text-center text-gray-400">
                Chưa có lịch sử
              </p>
            )}
            {historyItems.map((item, idx) => (
              <button
                key={idx}
                className="bg-[#F1F5FD] text-secondary py-3 px-4 rounded-full text-center hover:bg-gray-200 transition-colors"
                onClick={() => onHistoryClick(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LookUpPage;
