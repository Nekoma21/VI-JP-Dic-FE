import axiosClient from "../utils/axiosCustomize.js";

const deckAPI = {
  getList: () => {
    const url = `/decks`;
    return axiosClient.applicationAuth.get(url);
  },

  addDeck: (name: string) => {
    const url = `/decks`;
    return axiosClient.applicationAuth.post(url, { name });
  },

  updateDeck: (deckId: string, name: string) => {
    const url = `/decks/${deckId}`;
    return axiosClient.applicationAuth.put(url, { name });
  },

  deleteDeck: (deckId: string) => {
    const url = `/decks/${deckId}`;
    return axiosClient.applicationAuth.delete(url);
  },
  getDeckOverview: () => {
    const url = `/reviews/deckoverview`;
    return axiosClient.applicationAuth.get(url);
  }
};

export default deckAPI;
