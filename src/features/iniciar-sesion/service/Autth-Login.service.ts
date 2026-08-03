import { apiClient, validateApiResponse } from "@/core";
import type { LoginFormData } from "../hooks/useIniciarSesionPage";

export type LoginResponse = {
  access_token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
};

// DETALLE:  Login a la API para iniciar sesión
export async function login(datoLogin: LoginFormData): Promise<LoginResponse> {
  const { data } = await apiClient.post("api/Auth/login", datoLogin);
  return validateApiResponse<LoginResponse>(data);
}
