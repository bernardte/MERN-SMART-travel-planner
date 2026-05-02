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
    if (value instanceof File) {
      formData.append(key, value);
    } else if (typeof value === "object" && value !== null) {
      formData.append(key, JSON.stringify(value));
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  console.log("BASE URL:", axiosInstance.defaults.baseURL);
  console.log("FULL URL:", axiosInstance.defaults.baseURL + "/api/trips-plan/create");

  const res = await axiosInstance.post("/api/trips-plan/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return handleApiResponse(res);
};