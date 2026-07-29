/** Formato estándar de error HTTP de NestJS */
export type NestHttpException = {
  statusCode: number;
  message: string | string[];
  error?: string;
};

export type ApiErrorPayload = NestHttpException | { message?: string };

/** Envelope estándar de respuestas exitosas/fallidas del API */
export type ApiResponse<T> = {
  data: T;
  errors: string[];
  message: string;
  meta: unknown;
  statusCode: number;
  success: boolean;
  timestamp: string;
};

/* ─── Auth ─────────────────────────────────────────── */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  email: string;
  name?: string;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}
