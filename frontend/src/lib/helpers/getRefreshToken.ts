import useAuthStore from "@/stores/useAuthStore";
import axiosInstance from "../axios";
import { refreshTokenApi } from "@/api/auth.api";

let refreshPromise: Promise<string> | null = null;
export async function getRefreshToken(): Promise<string> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = new Promise(async (resolve, reject) => {
    try {
      const refreshToken = useAuthStore.getState().refreshToken;

      const response = await refreshTokenApi(refreshToken);

      const newAccessToken = response.data.accessToken;

      useAuthStore.getState().setAccessToken(newAccessToken);

      resolve(newAccessToken);
    } catch (err) {
      reject(err);
    } finally {
      refreshPromise = null;
    }
  });

  return refreshPromise;
}
