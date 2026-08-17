import { apiClient, validateApiResponse } from "@/core";
import { invalidateBotinesInventoryCache } from "@/features/gestion-botines/services/botines.service";
import { invalidateSandaliasInventoryCache } from "@/features/gestion-sandalias/services/sandalias.service";
import type {
  CrearVentaProductoRequest,
  CrearVentaProductoResponse,
  ImprimirEtiquetaVentaRequest,
  ImprimirEtiquetaVentaResponse,
} from "../models/ventaProducto.model";

export async function crearVentaProducto(
  payload: CrearVentaProductoRequest,
): Promise<CrearVentaProductoResponse> {
  const { data } = await apiClient.post(
    "api/botines-milas/venta-producto",
    payload,
  );
  const response = validateApiResponse<CrearVentaProductoResponse>(data);
  invalidateBotinesInventoryCache();
  invalidateSandaliasInventoryCache();
  return response;
}

export async function imprimirEtiquetaVenta(
  payload: ImprimirEtiquetaVentaRequest,
): Promise<ImprimirEtiquetaVentaResponse> {
  const { data } = await apiClient.post(
    "api/botines-milas/venta-producto/imprimir-etiqueta",
    payload,
  );
  return validateApiResponse<ImprimirEtiquetaVentaResponse>(data);
}
