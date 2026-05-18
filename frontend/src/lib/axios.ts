import axios from "axios";
import useAuthStore from "@/stores/useAuthStore";
import { getRefreshToken } from "./helpers/getRefreshToken";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { env } from "./zod/envSchema";

const axiosInstance = axios.create({
  baseURL:
    env.MODE === "development" ? env.VITE_BASE_URL : env.VITE_PRODUCTION_URL,
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
type FailedQueueItem = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};
let failedQueue: FailedQueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
      return;
    }

    if (token) {
      resolve(token);
    }
  });
  failedQueue = [];
};

// ! response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const original = error.config as any;
    const requestUrl = original?.url ?? "";
    const shouldSkipRefresh =
      requestUrl.includes("/api/users/login") ||
      requestUrl.includes("/api/users/register-account") ||
      requestUrl.includes("/api/refreshToken");

    if (
      error.response?.status === 401 &&
      !original?._retry &&
      !shouldSkipRefresh
    ) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers = original.headers ?? {};
          original.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(original);
        });
      }

      isRefreshing = true;

      try {
        const newToken = await getRefreshToken();
        processQueue(null, newToken);

        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${newToken}`;

        return axiosInstance(original);
      } catch (err) {
        processQueue(err);
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
