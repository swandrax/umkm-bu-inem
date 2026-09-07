import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/auth";
import { authApi } from "@/lib/api/auth";

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
          const res = await authApi.login(username, password);
          if (typeof window !== "undefined") {
            localStorage.setItem("jajanan_token", res.token);
          }
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
          const res = await authApi.register(fullName, username, password);
          if (typeof window !== "undefined") {
            localStorage.setItem("jajanan_token", res.token);
          }
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
        if (typeof window !== "undefined") {
          localStorage.removeItem("jajanan_token");
        }
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
