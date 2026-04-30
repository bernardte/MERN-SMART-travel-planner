import axiosInstance from "@/lib/axios";
import { handleApiResponse } from "@/lib/helpers/apiWrapper";

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