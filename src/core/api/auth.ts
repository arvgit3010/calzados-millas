import { apiClient } from "./axios";
import type { LoginResponse } from "./types";
import { validateApiResponse } from "./validateResponse";

type BackendLoginResponse = {
  access_token: string;
  user: {
    id: number | string;
    email: string;
    name?: string;
    role?: string;
  };
};

export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await apiClient.post("api/Auth/login", {
    email,
    password,
  });
  const response = validateApiResponse<BackendLoginResponse>(data);

  return {
    accessToken: response.access_token,
    user: {
      ...response.user,
      id: Number(response.user.id),
    },
  };
}
