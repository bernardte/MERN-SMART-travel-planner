import axiosInstance from "@/lib/axios";
import { handleApiResponse } from "@/lib/helpers/apiWrapper";
import type { travelGuideSchemaType } from "@/lib/zod/travelGuideSchema";
import { buildFormData } from "@/lib/helpers/buildFormData";

export const getItinerariesByUserIdApi = async (userId: string) => {
  const response = await axiosInstance.get(
    `/api/community/itineraries/${userId}`,
  );

  return handleApiResponse(response);
};

export const createTravelGuideApi = async (
  data: travelGuideSchemaType & { image?: File },
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

  return res.data.data;
};

export const updateTravelGuideApi = async (
  postId: string,
  data: travelGuideSchemaType & { image?: File },
  onProgress?: (percent: number) => void,
) => {

  const formData = buildFormData(data);
  console.log(data);
  const response = await axiosInstance.patch(
    "/api/community/edit/post/" + postId,
    formData,
    {
      onUploadProgress: (event) => {
        if (!onProgress || !event.total) return;
        onProgress?.(Math.round((event.loaded * 100) / event.total));
      },
    },
  );

  return response.data.data;
};

export const getAllPublicPostApi = async () => {
  const response = await axiosInstance.get("/api/community/public-posts");

  return handleApiResponse(response);
};

export const deleteOwnPostApi = async (postId: string) => {
  await axiosInstance.delete(`/api/community/delete-own-post/${postId}`);
}

export const likedAndUnlikedPostApi = async (postId: string) => {
  const response = await axiosInstance.post(`/api/community/liked-and-unliked/post/${postId}`);

  return response.data.data;
}

export const savedPost = async (postId: string) => {
  const response = await axiosInstance.post(`/api/community/saved/post/${postId}`);

  return response.data.data
}