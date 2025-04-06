import LookupArea from "../../components/lookups/index";

const LookUpPage = () => {
  const historyItems = Array(24).fill("効率");
  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 w-full h-full p-4 bg-gray-100 dark:bg-gray-800 mb-8">
        <LookupArea />

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl text-secondary font-medium mb-6">Lịch sử</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {historyItems.map((item, index) => (
              <button
                key={index}
                className="bg-[#F1F5FD] text-secondary py-3 px-4 rounded-full text-center hover:bg-gray-200 transition-colors cursor-pointer"
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
