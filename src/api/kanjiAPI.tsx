import axiosClient from "../utils/axiosCustomize.js";

const kanjiAPI = {
  getAll: (page: number, limit: number) => {
    const url = `/kanjis?page=${page}&limit=${limit}`;
    return axiosClient.applicationAuth.get(url);
  },
  // Add a new word
  create: (data: any) => {
    const url = `/kanjis`;
    return axiosClient.applicationAuth.post(url, data);
  },
  // Update an existing word
  update: (id: string, data: any) => {
    const url = `/kanjis/${id}`;
    return axiosClient.applicationAuth.put(url, data);
  },
  // Delete a word
  delete: (id: string) => {
    const url = `/kanjis/${id}`;
    return axiosClient.applicationAuth.delete(url);
  },
};

export default kanjiAPI;
