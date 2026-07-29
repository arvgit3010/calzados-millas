// import type { StockRow } from "@/shared/panel";
import { apiClient, validateApiResponse } from "@/core";
import {
  type BotinColorApi,
  type GetAllBotinesInventoryResponse,
  type ModelBotin,
  type ModelSeachParams,
  type ModelTalla,
} from "../models/botinesInventory.model";



/** Servicio de acceso a datos del inventario de botines.
 *  Actualmente retorna datos mock sincrónicos.
 *  Diseñado como punto de reemplazo: cuando exista un backend real,
 *  cambiar a async (Promise<StockRow[]>) y actualizar el hook. */
// export function getBotinesInventory(): StockRow[] {
//   return botinesInventory;
// }

/** GET colores disponibles de botines desde el API. */
export async function getBotinesColores(): Promise<BotinColorApi[]> {
  const { data } = await apiClient.get("api/botines-milas/get-colores-bottines");
  return validateApiResponse<BotinColorApi[]>(data);
}

export async function getBotinesModelos(): Promise<ModelBotin[]> {
  const { data } = await apiClient.get("api/botines-milas/get-modelos-bottines");
  return validateApiResponse<ModelBotin[]>(data);
}

export async function getBotinesTallas(): Promise<ModelTalla[]> {
  const { data } = await apiClient.get("api/botines-milas/get-tallas-bottines");
  return validateApiResponse<ModelTalla[]>(data);
}

export async function getBotinesInventory(): Promise<GetAllBotinesInventoryResponse[]> {
  const { data } = await apiClient.get("api/botines-milas/get-productos");
  return validateApiResponse<GetAllBotinesInventoryResponse[]>(data);
}

/** Busca productos de botines usando el endpoint search-producto del API. */
export async function searchBotinesInventory(search: ModelSeachParams): Promise<GetAllBotinesInventoryResponse[]> {
  const { data } = await apiClient.get("api/botines-milas/search-producto", {params: search});
  return validateApiResponse<GetAllBotinesInventoryResponse[]>(data);
}