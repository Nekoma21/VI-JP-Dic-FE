import axiosClient from "../utils/axiosCustomize.js";

const transcribeAPI = {
  transcribe: (file: File) => {
    const url = `/transcribe/`;
    const formData = new FormData();
    formData.append("file", file);
    return axiosClient.formDataAI.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default transcribeAPI;
