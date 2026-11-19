import { authClient } from "./auth-client";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined"
    ? window.location.origin.replace(":3000", ":5000")
    : "http://localhost:5000");

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: any;
}

export class ApiError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

interface RequestOptions extends RequestInit {
  token?: string;
  skipAuth?: boolean;
}

async function request<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { token, skipAuth, headers, ...restOptions } = options;

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(headers as Record<string, string>),
  };

  // Attach JWT token automatically for private calls
  if (!skipAuth) {
    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    } else if (typeof window !== "undefined") {
      try {
        const tokenRes = await (authClient as any).token?.();
        if (tokenRes?.data?.token) {
          requestHeaders["Authorization"] = `Bearer ${tokenRes.data.token}`;
        }
      } catch (e) {
        // Fallback silently if token fetch fails (e.g. unauthenticated)
      }
    }
  }

  try {
    const response = await fetch(url, {
      ...restOptions,
      headers: requestHeaders,
      credentials: "include", // for session cookies
    });

    const isJson = response.headers.get("content-type")?.includes("application/json");
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
      const errorMessage =
        data?.message || `Request failed with status ${response.status}: ${response.statusText}`;
      throw new ApiError(errorMessage, response.status, data);
    }

    return data as ApiResponse<T>;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error.message || "Failed to communicate with API server",
      0,
      null
    );
  }
}

export const api = {
  get: <T = any>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "GET" }),

  post: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T = any>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};
