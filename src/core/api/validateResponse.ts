import { ApiError } from "./errors";
import type { ApiResponse } from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeErrors(errors: unknown): string[] {
  if (!Array.isArray(errors)) return [];

  return errors
    .map((item) => {
      if (typeof item === "string") return item;
      if (isRecord(item) && typeof item.message === "string") return item.message;
      return null;
    })
    .filter((item): item is string => Boolean(item));
}

/** Comprueba si el payload tiene la forma del envelope ApiResponse. */
export function isApiResponse<T = unknown>(payload: unknown): payload is ApiResponse<T> {
  if (!isRecord(payload)) return false;

  return (
    "data" in payload &&
    "errors" in payload &&
    "message" in payload &&
    "statusCode" in payload &&
    "success" in payload &&
    typeof payload.message === "string" &&
    typeof payload.statusCode === "number" &&
    typeof payload.success === "boolean"
  );
}

/**
 * Valida el envelope del API y devuelve `data` tipado como `T`.
 * Lanza `ApiError` si la forma es inválida, `success` es false o hay errores.
 */
export function validateApiResponse<T>(payload: unknown): T {
  if (!isApiResponse<T>(payload)) {
    throw new ApiError(0, "Respuesta del servidor inválida");
  }

  const errors = normalizeErrors(payload.errors);
  const hasErrors = errors.length > 0;
  const isHttpError = payload.statusCode < 200 || payload.statusCode >= 300;

  if (!payload.success || hasErrors || isHttpError) {
    throw new ApiError(
      payload.statusCode || 0,
      errors[0] ?? payload.message ?? "Error en la solicitud",
      errors,
    );
  }

  return payload.data;
}
