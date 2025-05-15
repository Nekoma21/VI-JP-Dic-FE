import axiosClient from "../utils/axiosCustomize.js";

const compositionAPI = {
  getById: (id: string) => {
    const url = `/compositions/${id}`;
    return axiosClient.application.get(url);
  },
};

export default compositionAPI;
