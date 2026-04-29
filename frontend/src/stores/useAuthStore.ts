import type { User } from "@/types/interface.type";
import { create } from "zustand";

interface authStore {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  setUser: (user: User) => void;
  logout: () => void;
  setAccessToken: (accessToken: string) => void;
  setRefreshToken: (refreshToken: string) => void;
}

const useAuthStore = create<authStore>()((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  setUser: (user: User) => {
    set({ user: user });
  },
  logout: () => {
    set({
      user: null,
      accessToken: null,
    });
  },
  setAccessToken: (accessToken: string) => {
    set({
      accessToken: accessToken,
    });
  },
  setRefreshToken: (refreshToken: string) => {
    set({ refreshToken });
  },
}));

export default useAuthStore;
