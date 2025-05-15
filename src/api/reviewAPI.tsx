import axiosClient from "../utils/axiosCustomize.js";

const reviewAPI = {
  review: (cardId: string, deckId: string, rating: string) => {
    const url = `/reviews`;
    return axiosClient.applicationAuth.post(url, { cardId, deckId, rating });
  },
  preview: (cardId: string) => {
    const url = `/reviews/preview`;
    return axiosClient.applicationAuth.post(url, { cardId });
  },
  heatmap: () => {
    const url = `/reviews/heatmap`;
    return axiosClient.applicationAuth.post(url);
  },
  statsCard: () => {
    const url = `/reviews/stats-allcard`;
    return axiosClient.applicationAuth.get(url);
  },
};

export default reviewAPI;
