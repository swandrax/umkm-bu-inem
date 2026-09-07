import { apiClient } from "./client";
import { LoginResponse, User } from "@/types/auth";

export const authApi = {
  login: (username: string, password: string) =>
    apiClient.post<LoginResponse>("/auth/login", { username, password }),

  register: (fullName: string, username: string, password: string) =>
    apiClient.post<LoginResponse>("/auth/register", { fullName, username, password }),

  logout: () => apiClient.post<void>("/auth/logout"),

  getMe: () => apiClient.get<User>("/auth/me"),
};
