import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, LoginResponse } from "@/types/auth";
import { apiClient } from "@/lib/api-client";

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (username: string, password: string) => Promise<boolean>;
  register: (fullName: string, username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: () => boolean;
  isCashier: () => boolean;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const res = await apiClient.post<LoginResponse>("/auth/login", {
            username,
            password,
          });

          set({
            token: res.token,
            user: res.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return true;
        } catch (err: unknown) {
          const errorMsg =
            err instanceof Error ? err.message : "Gagal login. Periksa username dan password.";
          set({
            error: errorMsg,
            isLoading: false,
            isAuthenticated: false,
            token: null,
            user: null,
          });
          return false;
        }
      },

      register: async (fullName: string, username: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const res = await apiClient.post<LoginResponse>("/auth/register", {
            fullName,
            username,
            password,
          });

          set({
            token: res.token,
            user: res.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return true;
        } catch (err: unknown) {
          const errorMsg =
            err instanceof Error ? err.message : "Gagal mendaftar akun. Silakan coba lagi.";
          set({
            error: errorMsg,
            isLoading: false,
            isAuthenticated: false,
            token: null,
            user: null,
          });
          return false;
        }
      },

      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      isAdmin: () => get().user?.role === "ADMIN",
      isCashier: () => get().user?.role === "CASHIER" || get().user?.role === "ADMIN",
      setUser: (user: User) => set({ user }),
    }),
    {
      name: "jajanan-ibu-inem-auth",
    }
  )
);
