import axiosClient from "../utils/axiosCustomize.js";

const wordAPI = {
  search: (text: string) => {
    const url = `/words/search?text=${encodeURIComponent(text)}`;
    return axiosClient.application.get(url);
  },
  getWord: (wordId: string) => {
    const url = `/words/${wordId}`;
    return axiosClient.application.get(url);
  },
};

export default wordAPI;
