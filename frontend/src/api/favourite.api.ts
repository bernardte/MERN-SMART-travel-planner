import axiosInstance from "@/lib/axios"

export const getUserFavouriteTravelGuideApi = async () => {
    const response = await axiosInstance.get("/api/favourites/");

    return response.data.data;
}