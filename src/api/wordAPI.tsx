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
  getAll: (page: number, limit: number) => {
    const url = `/words?page=${page}&limit=${limit}`;
    return axiosClient.applicationAuth.get(url);
  },
  // Add a new word
  create: (data: any) => {
    const url = `/words`;
    return axiosClient.applicationAuth.post(url, data);
  },
  // Update an existing word
  update: (id: string, data: any) => {
    const url = `/words/${id}`;
    return axiosClient.applicationAuth.put(url, data);
  },
  // Delete a word
  delete: (id: string) => {
    const url = `/words/${id}`;
    return axiosClient.applicationAuth.delete(url);
  },
};

export default wordAPI;
