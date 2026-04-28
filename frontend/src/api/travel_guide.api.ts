import axiosInstance from "@/lib/axios";
import { handleApiResponse } from "@/lib/helpers/apiWrapper";
import type { CreateTravelGuideInputSchemaType } from "@/lib/zod/travelGuideSchema";
import { buildFormData } from "@/lib/helpers/buildFormData";
import { normalizeTravelGuide } from "@/lib/mapper/normalizeTravelGudie";

export const getItinerariesByUserId = async (userId: string) => {
  const response = await axiosInstance.get(
    `/api/community/itineraries/${userId}`,
  );

  return handleApiResponse(response);
};

export const createTravelGuide = async (
  data: CreateTravelGuideInputSchemaType & { image?: File },
  onProgress?: (percent: number) => void,
) => {
  const formData = buildFormData(data);

  const res = await axiosInstance.post("/api/community/create/post", formData, {
    onUploadProgress: (progressEvent) => {
      if (!progressEvent.total) return;

      const percent = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total,
      );

      onProgress?.(percent);
    },
  });

  return res.data;
};

export const getAllPublicPostApi = async () => {
  const response = await axiosInstance.get("/api/community/public-posts");

  return handleApiResponse(response);
};

export const deleteOwnPostApi = async (postId: string) => {
  await axiosInstance.delete(`/api/community/delete-own-post/${postId}`);
}