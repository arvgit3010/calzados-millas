export { CONTACT, whatsappLink } from "./config/contact";
export { ROUTES } from "./config/routes";
export {
  ApiError,
  apiClient,
  getApiErrorMessage,
  isApiResponse,
  toApiError,
  validateApiResponse,
} from "./api";
export type { ApiErrorPayload, ApiResponse, NestHttpException } from "./api";
export { AuthProvider, useAuth } from "./context";
export {
  BotinesSocketProvider,
  botinesSocket,
  dashboardSocket,
} from "./socket";
export type {
  BotinesStockUpdate,
  VentaRealizadaResumen,
} from "./socket";
