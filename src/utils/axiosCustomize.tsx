import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import queryString from "query-string";
import { NavigateFunction } from "react-router-dom";

// Lấy access token từ localStorage
const accessToken = localStorage.getItem("access_token");

// Định nghĩa kiểu cho axiosClient
interface AxiosClient {
  application: AxiosInstance;
  formData: AxiosInstance;
  formDataAuth: AxiosInstance;
  formDataAI: AxiosInstance;
}

// Tạo các instance của Axios
const axiosClient: AxiosClient = {
  application: axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      "content-type": "application/json",
      "Accept-Language": "vi",
    },
    paramsSerializer: (params) => queryString.stringify(params),
  }),

  formData: axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      "content-type": "multipart/form-data",
      "Accept-Language": "vi",
    },
  }),

  formDataAI: axios.create({
    baseURL: import.meta.env.VITE_FASTAPI_URL,
    headers: {
      "content-type": "multipart/form-data",
      "Accept-Language": "vi",
    },
  }),

  formDataAuth: axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      "content-type": "multipart/form-data",
      "Accept-Language": "vi",
      Authorization: `Bearer ${accessToken}`,
    },
  }),
};

// Hàm xử lý logout
const handleLogout = (navigate: NavigateFunction, toast: any) => {
  toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
  setTimeout(() => {
    localStorage.removeItem("user_info");
    localStorage.removeItem("access_token");
    navigate("/auth/login");
  }, 5000);
};

// Thiết lập interceptors
export const setupInterceptors = (navigate: NavigateFunction, toast: any) => {
  axiosClient.application.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 403 && (data as any).message === "Token has expired") {
          handleLogout(navigate, toast);
        }
      }
      return Promise.reject(error);
    }
  );

  axiosClient.formData.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 403 && (data as any).message === "Token has expired") {
          handleLogout(navigate, toast);
        }
      }
      return Promise.reject(error);
    }
  );
};

export default axiosClient;
