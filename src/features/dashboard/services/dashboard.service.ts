import { apiClient, validateApiResponse } from "@/core";
import type {
  DashboardAlertaStock,
  DashboardFiltro,
  DashboardMetricas,
  DashboardResumen,
} from "../models/dashboard.model";

function toParams(filtro: DashboardFiltro = {}) {
  const params: Record<string, string | number> = {};
  if (filtro.periodo) params.periodo = filtro.periodo;
  if (filtro.desde) params.desde = filtro.desde;
  if (filtro.hasta) params.hasta = filtro.hasta;
  if (filtro.idTipoCalzado != null) params.idTipoCalzado = filtro.idTipoCalzado;
  if (filtro.limit != null) params.limit = filtro.limit;
  return params;
}

/** @deprecated Prefer getDashboardMetricasApi */
export async function getDashboardResumenApi(): Promise<DashboardResumen> {
  const { data } = await apiClient.get("api/dashboard/get-resumen");
  return validateApiResponse<DashboardResumen>(data);
}

export async function getDashboardMetricasApi(
  filtro: DashboardFiltro = {},
): Promise<DashboardMetricas> {
  const { data } = await apiClient.get("api/dashboard/get-metricas", {
    params: toParams(filtro),
  });
  return validateApiResponse<DashboardMetricas>(data);
}

export async function getAlertasStockApi(): Promise<DashboardAlertaStock[]> {
  const { data } = await apiClient.get("api/dashboard/get-alertas-stock");
  const payload = validateApiResponse<{ alertasStock: DashboardAlertaStock[] }>(
    data,
  );
  return payload.alertasStock ?? [];
}
