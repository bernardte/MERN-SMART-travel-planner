import type { AxiosResponse } from "axios";

export const handleApiResponse = <T>(response: AxiosResponse<T>) => {
  const data: any = response.data;

  //! if backend says fail → throw error
  if (data?.success === false) {
    throw new Error(data?.message || "Request failed");
  }

  return response;
};
