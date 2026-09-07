export type Role = "ADMIN" | "CASHIER";

export interface User {
  id: number;
  username: string;
  fullName: string;
  role: Role;
  active: boolean;
  createdAt?: string;
}

export interface LoginResponse {
  token: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
  errorCode?: string;
  timestamp?: string;
}
