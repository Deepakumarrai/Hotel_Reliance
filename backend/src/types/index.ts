import { Request } from "express";

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
  name?: string;
  phone?: string;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export interface ApiResponse<T = any> {
  status: "success" | "error";
  message?: string;
  data?: T;
  error?: string;
}
