import axiosInstance from "@/lib/axios";
import { handleApiResponse } from "@/lib/helpers/apiWrapper";
import { buildFormData } from "@/lib/helpers/buildFormData";
import type { User } from "@/types/interface.type";

export const followAndUnfollowUserApi = async (userId: string) => {
    const response = await axiosInstance.patch(`/api/users/follow-unfollow-user/${userId}`);

    return response.data.data;
}; 

export const getUserProfileApi = async (username: string) => {
    const response = await axiosInstance.get(`/api/users/get-user-profile/${username}`);

    return response.data.data;
}

export const getUserPublishTravelGuideApi = async (userId: string) => {
    const response = await axiosInstance.get(
      `/api/users/get-user-publish-travel-guide/${userId}`,
    );

    return handleApiResponse(response);
}

export const updateUserProfileApi = async (data: Partial<{
    username: string;
    bio: string;
    profilePicture: File;
}>) => {
    const formData = buildFormData(data);
    const res = await axiosInstance.patch("/api/users/profile", formData);

    return res.data.data;
}

export const userProfileStatsApi = async (targetUsername: string) => {
    const res = await axiosInstance.get(
      "/api/users/profile/stats/" + targetUsername,
    );

    return res.data.data;
}