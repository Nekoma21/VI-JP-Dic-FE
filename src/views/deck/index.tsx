import { useState, useEffect } from "react";
import DeckList from "../../components/deck-list/";
import Navigation from "../../components/deck-navigation";
import FlashcardView from "../../components/flashcard";
import AddDeckModal from "./addDeckModal";
import StatsView from "../../components/stats";
import type { Deck } from "../../types/deck";
import deckAPI from "../../api/deckAPI";
import reviewAPI from "../../api/reviewAPI";

const DeckPage = () => {
  const [activeTab, setActiveTab] = useState<string>("Deck");
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isAddDeckModalOpen, setIsAddDeckModalOpen] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [heatmap, setHeatmap] = useState([]);

  const fetchDecks = async () => {
    try {
      const res = await deckAPI.getDeckOverview();
      setDecks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHeatmap = async () => {
    try {
      const res = await reviewAPI.heatmap();
      setHeatmap(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHeatmap();
    fetchDecks();
  }, []);

  const handleDeckClick = (deck: Deck) => {
    setSelectedDeck(deck);
    setShowStats(false);
  };

  const handleAddDeck = async (deckName: string) => {
    await deckAPI.addDeck(deckName);
    fetchDecks();
  };

  const handleShowAddDeckModal = () => {
    setIsAddDeckModalOpen(true);
    setShowStats(false);
  };

  const handleShowStats = () => {
    setSelectedDeck(null);
    setShowStats(true);
  };

  const handleBackToDeckList = () => {
    fetchHeatmap();
    fetchDecks();
    setSelectedDeck(null);
    setShowStats(false);
    setActiveTab("Deck");
  };

  return (
    <div className="w-full p-4">
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onAddDeck={handleShowAddDeckModal}
        onShowStats={handleShowStats}
        onBack={handleBackToDeckList}
      />

      {selectedDeck ? (
        <FlashcardView deck={selectedDeck} onBack={handleBackToDeckList} />
      ) : showStats ? (
        <StatsView />
      ) : (
        <DeckList
          decks={decks}
          heatmap={heatmap}
          onDeckClick={handleDeckClick}
          onRenameDeck={async () => {
            await fetchDecks();
          }}
          onUpdateCard={async () => {
            await fetchDecks();
          }}
          onDelete={fetchDecks}
        />
      )}

      <AddDeckModal
        isOpen={isAddDeckModalOpen}
        onClose={() => setIsAddDeckModalOpen(false)}
        onAddDeck={handleAddDeck}
      />
    </div>
  );
};

export default DeckPage;
