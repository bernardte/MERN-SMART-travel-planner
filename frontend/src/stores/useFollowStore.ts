// stores/useFollowStore.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { followAndUnfollowUserApi } from "@/api/user.api";

interface FollowStore {
  followingMap: Record<string, boolean>;
  loadingMap: Record<string, boolean>;

  setFollowingMap: (map: Record<string, boolean>) => void;

  toggleFollow: (targetUserId: string) => Promise<void>;
}

const useFollowStore = create<FollowStore>()(
  immer((set, get) => ({
    followingMap: {},
    loadingMap: {},

    setFollowingMap: (map) => {
      set({ followingMap: map });
    },

    toggleFollow: async (targetUserId) => {
      const prev = get().followingMap[targetUserId] ?? false;

      // ✅ optimistic UI
      set((state) => {
        state.loadingMap[targetUserId] = true;
        state.followingMap[targetUserId] = !prev;
      });

      try {
        const res = await followAndUnfollowUserApi(targetUserId);

        //  用 backend 覆盖（最重要）
        set((state) => {
          state.followingMap[targetUserId] = res.isFollowing;
        });
      } catch (err) {
        //  rollback
        set((state) => {
          state.followingMap[targetUserId] = prev;
        });
      } finally {
        set((state) => {
          state.loadingMap[targetUserId] = false;
        });
      }
    },
  })),
);

export default useFollowStore;
