import axiosInstance from "@/lib/axios";
import type {
  UserLoginSchemaType,
  UserSignUpSchemaType,
} from "@/lib/zod/userSchema";

export const loginApi = (data: UserLoginSchemaType) =>
  axiosInstance.post("/api/users/login", {
    email: data.email,
    password: data.password,
  });

export const registerAccountApi = (data: UserSignUpSchemaType) =>
  axiosInstance.post("/api/users/register-account", {
    name: data.fullname,
    password: data.password,
    email: data.email,
    username: data.username,
});

export const logoutApi = () => axiosInstance.post("/api/users/logout");

export const refreshTokenApi = (token: string | null) =>
  axiosInstance.get("/api/refreshToken/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
});