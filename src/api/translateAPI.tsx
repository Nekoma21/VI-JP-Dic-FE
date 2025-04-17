import axiosClient from "../utils/axiosCustomize.js";

const translateAPI = {
  detect: (file: File) => {
    const url = `/translates/detect`;
    const formData = new FormData();
    formData.append("file", file);
    return axiosClient.application.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  translate: (text: string) => {
    const url = `/translates`;
    return axiosClient.application.post(url, { text });
  },
};

export default translateAPI;
