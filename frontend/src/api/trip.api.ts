import axiosInstance from "@/lib/axios";
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
    console.log(response);
    return response.data;
}


export async function getSpecificTripApi(id:string) {
  const res = await axiosInstance.get(
    `/api/trips/${id}`
  );
  return res.data.data.trip;
}
