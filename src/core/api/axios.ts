import axios from "axios";
import { API_URL } from "../config/env";
import { toApiError } from "./errors";

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15_000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: () => void) {
  unauthorizedHandler = handler;
}

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const url = error.config?.url ?? "";
      const isAuthRequest = url.includes("api/auth/login");
      if (!isAuthRequest) {
        unauthorizedHandler?.();
      }
    }
    return Promise.reject(toApiError(error));
  },
);
