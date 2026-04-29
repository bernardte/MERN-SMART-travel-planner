import {
  deleteOwnPostApi,
  getAllPublicPostApi,
  getItinerariesByUserId,
} from "@/api/travel_guide.api";
import type { TravelGuide } from "@/types/interface.type";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface communityTravelGuideStore {
  itineraries: TravelGuide[] | null;
  publicPost: TravelGuide[] | null;
  error: null | string;
  loading: {
    publicPost: boolean;
    itineraries: boolean;
    deletePost: boolean;
  };
  getSpecificUserItineraries: (userId: string) => Promise<void>;
  getAllPublicPost: () => Promise<void>;
  deleteOwnPost: (postId: string) => Promise<void>;
}

const useCommunityTravelGuideStore = create<communityTravelGuideStore>()(
  immer((set) => ({
    itineraries: null,
    error: null,
    loading: {
      publicPost: false,
      itineraries: false,
      deletePost: false,
    },
    publicPost: null,
    getSpecificUserItineraries: async (userId: string) => {
      set((state) => {
        state.loading.itineraries = true;
        state.error = null
      });
      try {
        const result = await getItinerariesByUserId(userId);
        set({ itineraries: result.data.data });
      } catch (error: any) {
         set((state) => {
           state.error =
             error?.response?.data?.message || "failed to fetch specific user itineraries";
         });
      } finally {
        set((state) => {
          state.loading.itineraries = false;
        });
      }
    },
    getAllPublicPost: async () => {
      set((state) => {
        state.loading.publicPost = true;
        state.error = null;
      });
      try {
        const result = await getAllPublicPostApi();
        console.log(result.data.data);
        set({ publicPost: result.data.data });
      } catch (error: any) {
        set((state) => {
          state.error =
            error?.response?.data?.message ||
            "failed to fetch all public post";
        });
      } finally {
        set((state) => {
          state.loading.publicPost = false;
        });
      }
    },
    deleteOwnPost: async (postId: string) => {
      set((state) => {
        state.loading.deletePost = true;
        state.error = null;
      });
      try {
        await deleteOwnPostApi(postId);
        set((state) => {
          if (!state.publicPost) return;

          state.publicPost = state.publicPost.filter(
            (post) => post._id !== postId,
          );
        });
      } catch (error: any) {
        set((state) => {
          state.error =
            error?.response?.data?.message || "failed to delete own post";
        });
      } finally {
        set((state) => {
          state.loading.publicPost = false;
          state.error = null;
        });
      }
    },
  })),
);

export default useCommunityTravelGuideStore;
