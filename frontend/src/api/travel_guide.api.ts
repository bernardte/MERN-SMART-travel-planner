import axiosInstance from "@/lib/axios";
import { handleApiResponse } from "@/lib/helpers/apiWrapper";
import type { guideSchemaType } from "@/lib/zod/travelGuideSchema";

export const createTravelGuide = async (guideData: guideSchemaType) => {
  const formData = new FormData();
  Object.entries(guideData).forEach(([key, value]) => {
    formData.append(
      key,
      typeof value === "object" ? JSON.stringify(value) : value
    )
  })
  const res = await axiosInstance.post("/api/travel-guide/create", formData);

  return handleApiResponse(res);
};
