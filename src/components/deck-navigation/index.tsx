import type React from "react";

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onAddDeck: () => void;
  onShowStats: () => void;
  onBack: () => void;
}

const DeckNavigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  onAddDeck,
  onShowStats,
  onBack,
}) => {
  const tabs = ["Deck", "Add", "Stats"];
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);

    if (tab === "Deck") {
      onBack();
    } else if (tab === "Add") {
      onAddDeck();
    } else if (tab === "Stats") {
      onShowStats();
    }
  };

  return (
    <div className="bg-white rounded-full shadow-md mb-6 overflow-hidden max-w-3xl mx-auto">
      <div className="flex justify-between">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`flex-1 py-4 text-center text-lg font-medium ${
              activeTab === tab ? "text-[#2d60ff]" : "text-[#656565]"
            }`}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DeckNavigation;
