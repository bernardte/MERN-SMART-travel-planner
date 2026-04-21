import axios from "axios";
import useAuthStore from "@/stores/useAuthStore";
import { getRefreshToken } from "./helpers/getRefreshToken";
import type {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { env } from "./zod/envSchema";

const axiosInstance = axios.create({
  baseURL: env.VITE_BASE_URL,
  withCredentials: true,
});

/**
 * Silent refresh token
 */

// ! request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (token: string) => {
  failedQueue.forEach((cb) => cb(token));
  failedQueue = [];
};

// ! response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const original = error.config as any;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          failedQueue.push((token: string) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(axiosInstance(original));
          });
        });
      }

      isRefreshing = true;

      try {
        const newToken = await getRefreshToken();

        processQueue(newToken);

        original.headers.Authorization = `Bearer ${newToken}`;

        return axiosInstance(original);
      } catch (err) {
        useAuthStore.getState().logout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
