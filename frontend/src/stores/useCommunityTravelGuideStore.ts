import {
  deleteOwnPostApi,
  getAllPublicPostApi,
  getItinerariesByUserIdApi,
} from "@/api/travel_guide.api";
import type { TravelGuide } from "@/types/interface.type";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface communityTravelGuideStore {
  itineraries: TravelGuide[] | null;
  publicPost: TravelGuide[] | null;
  error: {
    publicPostError: string | null;
    itinerariesError: string | null;
    deletePostError: string | null;
  };
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
    error: {
      publicPostError: null,
      itinerariesError: null,
      deletePostError: null,
    },
    loading: {
      publicPost: false,
      itineraries: false,
      deletePost: false,
    },
    publicPost: null,
    getSpecificUserItineraries: async (userId: string) => {
      set((state) => {
        state.loading.itineraries = true;
        state.error.itinerariesError = null;
      });
      try {
        const result = await getItinerariesByUserIdApi(userId);
        set({ itineraries: result.data.data });
      } catch (error: any) {
         set((state) => {
           state.error.itinerariesError =
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
        state.error.publicPostError = null
      });
      try {
        const result = await getAllPublicPostApi();
        console.log(result.data.data);
        set({ publicPost: result.data.data });
      } catch (error: any) {
        set((state) => {
         state.error.publicPostError =
           error?.response?.data?.message ||
           "failed to get public post";
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
        state.error.deletePostError = null;
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
         state.error.deletePostError =
           error?.response?.data?.message || "failed to delete own post";
        });
      } finally {
        set((state) => {
          state.loading.deletePost = false;
        });
      }
    },
    
  })),
);

export default useCommunityTravelGuideStore;
