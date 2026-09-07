import { ApiResponse } from "@/types/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export class ApiError extends Error {
  errorCode?: string;
  status: number;

  constructor(message: string, status: number, errorCode?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errorCode = errorCode;
  }
}

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("jajanan-ibu-inem-auth");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.token || null;
  } catch {
    return null;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  const token = getStoredToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
      localStorage.removeItem("jajanan-ibu-inem-auth");
      window.dispatchEvent(new CustomEvent("pos:unauthorized"));
    }
    throw new ApiError("Sesi login Anda telah berakhir. Silakan login kembali.", 401, "UNAUTHORIZED");
  }

  const data: ApiResponse<T> = await response.json().catch(() => ({
    success: response.ok,
    message: response.statusText,
    data: null as unknown as T,
  }));

  if (!response.ok || !data.success) {
    throw new ApiError(data.message || "Terjadi kesalahan pada server", response.status, data.errorCode);
  }

  return data.data;
}

export const apiClient = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: "GET" }),

  post: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string) => request<T>(endpoint, { method: "DELETE" }),

  downloadBlob: async (endpoint: string): Promise<Blob> => {
    const url = `${BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
    const token = getStoredToken();

    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new ApiError("Gagal mengunduh file", response.status);
    }
    return await response.blob();
  },
};
