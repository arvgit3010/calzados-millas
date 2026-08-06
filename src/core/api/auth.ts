import { apiClient } from "./axios";
import type { AuthUser, LoginResponse } from "./types";
import { validateApiResponse } from "./validateResponse";

type BackendLoginResponse = {
  access_token: string;
  user: AuthUser;
};

export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await apiClient.post("api/auth/login", {
    email,
    password,
  });
  const response = validateApiResponse<BackendLoginResponse>(data);

  return {
    accessToken: response.access_token,
    user: response.user,
  };
}

export async function getMe(): Promise<AuthUser> {
  const { data } = await apiClient.get("api/auth/me");
  return validateApiResponse<AuthUser>(data);
}
