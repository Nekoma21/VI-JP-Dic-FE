import axiosClient from "../utils/axiosCustomize.js";

interface userData {
  fullname: string;
  birthday: string;
  sex: boolean;
  level: number;
  demand: string;
}

interface passwordConfirm {
  currentPassword: string;
  newPassword: string;
}

const userAPI = {
  get: () => {
    const url = `/users`;
    return axiosClient.application.get(url);
  },
  update: (userData: userData) => {
    const url = `/users`;
    return axiosClient.application.put(url, userData);
  },
  updateUsername: (username: string) => {
    const url = `/users/username`;
    return axiosClient.application.patch(url, { username });
  },
  updatePassword: (passwordConfirm: passwordConfirm) => {
    const url = `/users/password`;
    return axiosClient.application.patch(url, passwordConfirm);
  },
  uploadImage: (file: File) => {
    const url = `/users/upload`;
    const formData = new FormData();
    formData.append("avatar", file);
    return axiosClient.formDataAuth.patch(url, formData);
  },
};

export default userAPI;
