import axiosClient from "../utils/axiosCustomize.js";

const cardAPI = {
  getCardsByDeck: (deckId: string) => {
    const url = `/cards/${deckId}`;
    return axiosClient.applicationAuth.get(url);
  },

  addCard: (
    deckId: string,
    cardData: {
      word: string;
      sentence: string;
      reading: string;
      meaning: string;
    }
  ) => {
    const url = `/cards/${deckId}`;
    return axiosClient.applicationAuth.post(url, cardData);
  },

  updateCard: (
    cardId: string,
    cardData: {
      word: string;
      sentence: string;
      reading: string;
      meaning: string;
    }
  ) => {
    const url = `/cards/${cardId}`;
    return axiosClient.applicationAuth.put(url, cardData);
  },

  deleteCard: (cardId: string) => {
    const url = `/cards/${cardId}`;
    return axiosClient.applicationAuth.delete(url);
  },
};

export default cardAPI;
