import { apiClient, validateApiResponse } from "@/core";
import type {
  ReporteCatalogo,
  ReporteCodigo,
  ReporteCsvExport,
  ReporteExcelExport,
  ReporteFiltro,
  ReporteTabla,
} from "../models/reportes.model";

function toParams(filtro: ReporteFiltro = {}) {
  const params: Record<string, string | number> = {};
  if (filtro.periodo) params.periodo = filtro.periodo;
  if (filtro.desde) params.desde = filtro.desde;
  if (filtro.hasta) params.hasta = filtro.hasta;
  if (filtro.idTipoCalzado != null) params.idTipoCalzado = filtro.idTipoCalzado;
  if (filtro.limit != null) params.limit = filtro.limit;
  if (filtro.stockMax != null) params.stockMax = filtro.stockMax;
  if (filtro.stockObjetivo != null) params.stockObjetivo = filtro.stockObjetivo;
  return params;
}

const DETAIL_PATH: Record<ReporteCodigo, string> = {
  ventas: "api/reportes/get-ventas",
  compras: "api/reportes/get-compras",
  inventario: "api/reportes/get-inventario",
  ganancias: "api/reportes/get-ganancias",
  "pares-por-precio": "api/reportes/get-pares-por-precio",
  reposicion: "api/reportes/get-reposicion",
};

export async function getReportesCatalogoApi(
  filtro: ReporteFiltro = {},
): Promise<ReporteCatalogo> {
  const { data } = await apiClient.get("api/reportes/get-catalogo", {
    params: toParams(filtro),
  });
  return validateApiResponse<ReporteCatalogo>(data);
}

export async function getReporteDetalleApi(
  codigo: ReporteCodigo,
  filtro: ReporteFiltro = {},
): Promise<ReporteTabla> {
  const { data } = await apiClient.get(DETAIL_PATH[codigo], {
    params: toParams(filtro),
  });
  return validateApiResponse<ReporteTabla>(data);
}

export async function exportarReporteCsvApi(
  codigo: ReporteCodigo,
  filtro: ReporteFiltro = {},
): Promise<ReporteCsvExport> {
  const { data } = await apiClient.get("api/reportes/exportar-csv", {
    params: { ...toParams(filtro), tipo: codigo },
  });
  return validateApiResponse<ReporteCsvExport>(data);
}

export function downloadCsvFile(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function exportarExcelReposicionApi(
  filtro: ReporteFiltro = {},
): Promise<ReporteExcelExport> {
  const { data } = await apiClient.get("api/reportes/exportar-excel-reposicion", {
    params: toParams({ ...filtro, limit: filtro.limit ?? 500 }),
  });
  return validateApiResponse<ReporteExcelExport>(data);
}

export function downloadBase64File(
  filename: string,
  base64: string,
  mimeType: string,
) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
