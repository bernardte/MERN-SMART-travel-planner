import axiosInstance from "@/lib/axios";
import { handleApiResponse } from "@/lib/helpers/apiWrapper";
import type { tripSchemaType } from "@/lib/zod/tripSchema";
import type { DayEntry } from "@/pages/planNewTrip/editTripPage";

export async function planNewTripApi(
  country: string,
  startDate: string,
  endDate: string,
  days: DayEntry[],
) {
  await axiosInstance.post("/api/trips/save", {
    country,
    startDate,
    endDate,
    days: days,
  });
}

export async function editTripApi(
  country: string,
  startDate: string,
  endDate: string,
  days: DayEntry[],
  id: string,
) {
  await axiosInstance.put(`/api/trips/${id}`, {
    country,
    startDate,
    endDate,
    days: days,
  });
}

export async function deleteTripApi(tripId: string) {
  const res = await axiosInstance.delete(`/api/trips/${tripId}`);
  return res.data;
}

export async function getTripApi() {
  const response = await axiosInstance.get("/api/trips/my-trips");
  return response.data;
}

export async function getSpecificTripApi(id: string) {
  const res = await axiosInstance.get(`/api/trips/${id}`);
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

  const res = await axiosInstance.post("/api/trips-plan/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return handleApiResponse(res);
};

export const getTripPlanByItineraryIdApi = async (itineraryId: string) => {
  const res = await axiosInstance.get(
    `/api/trips-plan/by-itinerary/${itineraryId}`,
  );
  return handleApiResponse(res);
};

export const getTripPlanApi = async (tripPlanId: string) => {
  const res = await axiosInstance.get(`/api/trips-plan/${tripPlanId}`);
  return handleApiResponse(res);
};

export const updateTripPlanApi = async (
  tripPlanId: string,
  tripData: Omit<tripSchemaType, "tripId">,
) => {
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

  const res = await axiosInstance.put(
    `/api/trips-plan/${tripPlanId}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );

  return handleApiResponse(res);
};

export const createCommentTripPlanApi = async (
  tripPlanId: string,
  data: { content: string },
) => {
  const response = await axiosInstance.post(
    `/api/trips-plan/${tripPlanId}/comments`,
    data,
  );

  return response.data.data;
};

export const getCommentTripPlanApi = async (tripPlanId: string) => {
  const response = await axiosInstance.get(
    `/api/trips-plan/${tripPlanId}/comments`,
  );

  return response.data.data;
};

export const deleteCommentTripPlanApi = async (
  tripPlanId: string,
  commentId: string,
) => {
  await axiosInstance.delete(
    `/api/trips-plan/${tripPlanId}/comments/${commentId}`,
  );
};

export const updateCommentTripPlanApi = async (
  tripPlanId: string,
  commentId: string,
  comment: string,
) => {
  const response = await axiosInstance.patch(
    `/api/trips-plan/${tripPlanId}/comments/${commentId}`,{
      content: comment
    }
  );

  return response.data.data;
};
