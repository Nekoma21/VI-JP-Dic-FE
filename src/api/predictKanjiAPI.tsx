import axiosClient from "../utils/axiosCustomize.js";

const predictKanjiAPI = {
  predict: (formData: FormData) => {
    const url = `/predict`;
    return axiosClient.predict.post(url, formData);
  },
};

export default predictKanjiAPI;
