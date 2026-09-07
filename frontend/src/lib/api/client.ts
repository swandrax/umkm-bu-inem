import { ApiResponse } from "@/types/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errorCode?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("jajanan_token")
      : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("jajanan_token");
      window.dispatchEvent(new CustomEvent("unauthorized"));
    }
  }

  const data: ApiResponse<T> = await res.json().catch(() => ({
    success: false,
    message: res.statusText || "Terjadi kesalahan jaringan",
    data: null as unknown as T,
  }));

  if (!res.ok || !data.success) {
    throw new ApiError(
      data.message || `Request failed with status ${res.status}`,
      res.status,
      data.errorCode
    );
  }

  return data.data;
}

export async function downloadBlob(endpoint: string): Promise<Blob> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("jajanan_token")
      : null;

  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;

  const res = await fetch(url, {
    headers,
  });

  if (!res.ok) {
    throw new ApiError("Gagal mengunduh file", res.status);
  }

  return res.blob();
}

export const apiClient = {
  get: <T>(url: string, options?: RequestInit) =>
    request<T>(url, { ...options, method: "GET" }),
  post: <T>(url: string, body?: unknown, options?: RequestInit) =>
    request<T>(url, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),
  put: <T>(url: string, body?: unknown, options?: RequestInit) =>
    request<T>(url, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(url: string, options?: RequestInit) =>
    request<T>(url, { ...options, method: "DELETE" }),
  downloadBlob,
};
