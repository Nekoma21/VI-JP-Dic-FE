import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import queryString from "query-string";
import { NavigateFunction } from "react-router-dom";

const axiosClient = {
  application: axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      "content-type": "application/json",
      "Accept-Language": "vi",
    },
    paramsSerializer: (params) => queryString.stringify(params),
  }),

  applicationAuth: axios.create({
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

  formDataAuth: axios.create({
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
};

[axiosClient.applicationAuth, axiosClient.formDataAuth].forEach((instance) => {
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
});

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) return null;

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}auth/refresh`,
      { refreshToken },
      {
        headers: {
          // dùng axios gốc để gọi
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    const newAccessToken = response.data.accessToken;
    localStorage.setItem("access_token", newAccessToken);
    return newAccessToken;
  } catch {
    return null;
  }
};

const handleLogout = (navigate: NavigateFunction) => {
  setTimeout(() => {
    localStorage.removeItem("user_info");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/auth/login", { replace: true });
  }, 2000);
};

export const setupInterceptors = (navigate: NavigateFunction) => {
  [axiosClient.applicationAuth, axiosClient.formDataAuth].forEach(
    (instance) => {
      instance.interceptors.response.use(
        (response: AxiosResponse) => response,
        async (error: AxiosError) => {
          const originalRequest = error.config as any;
          if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const newToken = await refreshAccessToken();
            if (newToken) {
              instance.defaults.headers = instance.defaults.headers || {};
              instance.defaults.headers.Authorization = `Bearer ${newToken}`;

              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return instance(originalRequest);
            }

            handleLogout(navigate);
          }

          return Promise.reject(error);
        }
      );
    }
  );
};
export default axiosClient;
