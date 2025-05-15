import axiosClient from "../utils/axiosCustomize.js";

const ankiAPI = {
  handleReview: (data: { cardId: string; deckId: string; rating: string }) => {
    const url = `/reviews`;
    return axiosClient.applicationAuth.post(url, data);
  },

  previews: (cardId: string) => {
    const url = `/reviews/preview`;
    return axiosClient.applicationAuth.post(url, { cardId });
  },

  statsCard: (deckId: string) => {
    const url = `/reviews/statscard`;
    return axiosClient.applicationAuth.post(url, { deckId });
  },

  newsCard: (deckId: string) => {
    const url = `/reviews/dailynewcard`;
    return axiosClient.applicationAuth.post(url, { deckId });
  },
};

export default ankiAPI;
