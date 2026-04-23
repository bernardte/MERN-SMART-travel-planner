import axiosInstance from "@/lib/axios";
import type {
  UserLoginSchemaType,
  UserSignUpSchemaType,
} from "@/lib/zod/userSchema";
import { handleApiResponse } from "@/lib/helpers/apiWrapper";

export const loginApi = async (data: UserLoginSchemaType) => {
  const res = await axiosInstance.post("/api/users/login", {
    email: data.email,
    password: data.password,
  });

  return handleApiResponse(res);
};

export const registerAccountApi = async (data: UserSignUpSchemaType) => {
  const res = await axiosInstance.post("/api/users/register-account", {
    name: data.fullname,
    password: data.password,
    email: data.email,
    username: data.username,
  });

  return handleApiResponse(res);
};

export const logoutApi = async () => {
  const res = await axiosInstance.post("/api/users/logout");
  return handleApiResponse(res);
};

export const refreshTokenApi = async (token: string | null) => {
  const res = await axiosInstance.get("/api/refreshToken/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleApiResponse(res);
};

export const getLoginUserApi = async () => {
  const res = await axiosInstance.get("/api/users/get-login-user");
  return handleApiResponse(res);
};