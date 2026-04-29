import { getSpecificTripApi } from "@/api/trip.api";
import type { Trip } from "@/types/interface.type";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface tripStore {
  trips: Trip | null;
  error: null | string;
  isLoading: boolean;
  getSpecificTrip: (id: string) => Promise<void>;
}

const useTripStore = create<tripStore>()(
  immer((set) => ({
    trips: null,
    error: null,
    isLoading: false,
    getSpecificTrip: async (id: string) => {
      set({ isLoading: true, error: null });
      try {
        const result = await getSpecificTripApi(id);
        set({ trips: result });
      } catch (error: any) {
        set({
          error:
            error?.response?.data?.message ||
            "failed to fetch specific trip data",
        });
      } finally {
        set({ isLoading: false });
      }
    },
  })),
);

export default useTripStore;
