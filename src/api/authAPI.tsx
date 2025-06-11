import axiosClient from "../utils/axiosCustomize.js";

interface FormData {
  email: string;
  password: string;
}

const AuthAPI = {
  login: (formData: FormData) => {
    const url = `/auth/login`;
    return axiosClient.application.post(url, formData);
  },
  register: (formData: FormData) => {
    const url = `/auth/sign-up`;
    return axiosClient.application.post(url, formData);
  },
  verifyUser: (userId: string, token: string) => {
    const url = `/auth/verify/${userId}/${token}`;
    return axiosClient.application.get(url);
  },
  refresh: (token: string) => {
    const url = `/auth/refresh`;
    return axiosClient.application.post(url, token);
  },

  forgotPassword: (email: string) => {
    const url = `/auth/forgot-password`;
    return axiosClient.application.post(url, { email });
  },

  verifyMailReset: (userId: string, token: string) => {
    const url = `/auth/verify-mail-reset/${userId}/${token}`;
    return axiosClient.application.get(url);
  },

  resetPassword: (
    userId: string,
    token: string,
    data: { password: string }
  ) => {
    const url = `/auth/reset-password/${userId}/${token}`;
    return axiosClient.application.post(url, data);
  },
};

export default AuthAPI;
