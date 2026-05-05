import axiosInstance from "@/lib/axios";

export const getPopularDestination = async() => {
    const response = await axiosInstance.get("/api/trips/popular-destination");

    return response.data.data;
};