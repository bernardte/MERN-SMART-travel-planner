import axiosInstance from "@/lib/axios";
import { handleApiResponse } from "@/lib/helpers/apiWrapper";
import type { tripSchemaType } from "@/lib/zod/tripSchema";
import type { DayEntry } from "@/pages/planNewTrip/editTripPage";

export async function planNewTripApi(country: string, startDate: string, endDate: string, days: DayEntry[]){
    await axiosInstance.post(
        "/api/trips/save",
        { country, startDate, endDate, days: days },
        );
}

export async function editTripApi(country: string, startDate: string, endDate: string, days: DayEntry[], id: string){
    await axiosInstance.put(
        `/api/trips/${id}`,
        { country, startDate, endDate, days: days },
    );
}

export async function deleteTripApi(tripId:string) {
  const res = await axiosInstance.delete(
    `/api/trips/${tripId}`
);
  return res.data;
}

export async function getTripApi(){
    const response = await axiosInstance.get(
        "/api/trips/my-trips"
    );
    return response.data;
}
 
export async function getSpecificTripApi(id:string) {
  const res = await axiosInstance.get(
    `/api/trips/${id}`
  );
  return res.data.data.trip;
}


export const createTripPlanApi = async (tripData: tripSchemaType) => {
  const formData = new FormData();
  Object.entries(tripData).forEach(([key, value]) => {
    formData.append(
      key,
      typeof value === "object" ? JSON.stringify(value) : value,
    );
  });
  const res = await axiosInstance.post("/api/trips-plan/create", formData);

  return handleApiResponse(res);
};
