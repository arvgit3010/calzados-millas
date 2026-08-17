import { io, type Socket } from "socket.io-client";
import { API_URL } from "@/core/config/env";
import type { DashboardRefreshPayload } from "@/features/dashboard/models/dashboard.model";

type DashboardServerEvents = {
  "dashboard-refresh": (payload: DashboardRefreshPayload) => void;
  "dashboard-metricas": (payload: unknown) => void;
};

const socketBaseUrl = API_URL.replace(/\/+$/, "");

export const dashboardSocket: Socket<DashboardServerEvents> = io(
  `${socketBaseUrl}/dashboard`,
  {
    autoConnect: false,
    transports: ["websocket", "polling"],
  },
);
