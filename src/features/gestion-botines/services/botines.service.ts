import { apiClient, validateApiResponse } from "@/core";
import {
  type BotinColorApi,
  type GetAllBotinesInventoryResponse,
  type ModelBotin,
  type ModelSeachParams,
  type ModelTalla,
  type ModelRango,
  type ModelTipoLote,
  type CrearBotinProductoRequest,
  type ModelparamsConsultaDatosModelosTallas,
  type ConsultaDatosModelosTallasResponse,
} from "../models/botinesInventory.model";

const INVENTORY_CACHE_TTL_MS = 15_000;
const LOOKUP_CACHE_TTL_MS = 5 * 60_000;
const SEARCH_CACHE_TTL_MS = 30_000;
let inventoryCache:
  | { data: GetAllBotinesInventoryResponse[]; expiresAt: number }
  | null = null;
let inventoryRequest: Promise<GetAllBotinesInventoryResponse[]> | null = null;
const stockDetailCache = new Map<
  string,
  { data: ConsultaDatosModelosTallasResponse; expiresAt: number }
>();
const stockDetailRequests = new Map<
  string,
  Promise<ConsultaDatosModelosTallasResponse>
>();
const lookupCache = new Map<
  string,
  { data: unknown; expiresAt: number }
>();
const lookupRequests = new Map<string, Promise<unknown>>();
const searchCache = new Map<
  string,
  { data: GetAllBotinesInventoryResponse[]; expiresAt: number }
>();
const searchRequests = new Map<
  string,
  Promise<GetAllBotinesInventoryResponse[]>
>();

async function getCachedLookup<T>(url: string): Promise<T> {
  const cached = lookupCache.get(url);
  if (cached && cached.expiresAt > Date.now()) return cached.data as T;

  const pending = lookupRequests.get(url);
  if (pending) return pending as Promise<T>;

  const request = apiClient
    .get(url)
    .then(({ data }) => {
      const response = validateApiResponse<T>(data);
      lookupCache.set(url, {
        data: response,
        expiresAt: Date.now() + LOOKUP_CACHE_TTL_MS,
      });
      return response;
    })
    .finally(() => {
      lookupRequests.delete(url);
    });
  lookupRequests.set(url, request);
  return request;
}

export function invalidateBotinesInventoryCache(): void {
  inventoryCache = null;
  stockDetailCache.clear();
  searchCache.clear();
}

/** GET colores disponibles de botines desde el API. */
export async function getBotinesColoresApi(): Promise<BotinColorApi[]> {
  return getCachedLookup<BotinColorApi[]>(
    "api/botines-milas/get-colores-bottines",
  );
}

/** GET modelos de botines desde el API. */
export async function getBotinesModelosApi(): Promise<ModelBotin[]> {
  return getCachedLookup<ModelBotin[]>(
    "api/botines-milas/get-modelos-bottines",
  );
}

/** GET tallas disponibles de botines desde el API. */
export async function getBotinesTallasApi(): Promise<ModelTalla[]> {
  return getCachedLookup<ModelTalla[]>(
    "api/botines-milas/get-tallas-bottines",
  );
}

/** GET rangos (packs 5-8, 5-9, OTRO, ...) desde el API. */
export async function getBotinesRangosOptionsApi(): Promise<ModelRango[]> {
  return getCachedLookup<ModelRango[]>("api/botines-milas/get-rango");
}

/** GET tipos de lote (docena, media docena, ...) desde el API. */
export async function getBotinesTiposLoteOptionsApi(): Promise<ModelTipoLote[]> {
  return getCachedLookup<ModelTipoLote[]>("api/botines-milas/get-tipo-lote");
}

/** GET inventario completo de botines para la grilla. */
export async function getBotinesInventoryProducts(): Promise<GetAllBotinesInventoryResponse[]> {
  if (inventoryCache && inventoryCache.expiresAt > Date.now()) {
    return inventoryCache.data;
  }
  if (inventoryRequest) return inventoryRequest;

  inventoryRequest = apiClient
    .get("api/botines-milas/get-productos")
    .then(({ data }) => {
      const products =
        validateApiResponse<GetAllBotinesInventoryResponse[]>(data);
      inventoryCache = {
        data: products,
        expiresAt: Date.now() + INVENTORY_CACHE_TTL_MS,
      };
      return products;
    })
    .finally(() => {
      inventoryRequest = null;
    });

  return inventoryRequest;
}

/** Busca productos de botines usando el endpoint search-producto del API. */
export async function searchBotinesInventoryProduct(
  search: ModelSeachParams,
): Promise<GetAllBotinesInventoryResponse[]> {
  const cacheKey = search.inputDescriptionSearch.trim().toUpperCase();
  const cached = searchCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  const pending = searchRequests.get(cacheKey);
  if (pending) return pending;

  const request = apiClient
    .get("api/botines-milas/search-producto", { params: search })
    .then(({ data }) => {
      const products =
        validateApiResponse<GetAllBotinesInventoryResponse[]>(data);
      searchCache.set(cacheKey, {
        data: products,
        expiresAt: Date.now() + SEARCH_CACHE_TTL_MS,
      });
      return products;
    })
    .finally(() => {
      searchRequests.delete(cacheKey);
    });

  searchRequests.set(cacheKey, request);
  return request;
}

/** Crea un nuevo producto / lote de compra de botines en el backend. */
export async function createBotinProductoApiInventory(payload: CrearBotinProductoRequest): Promise<void> {
  const { data } = await apiClient.post("api/botines-milas/create-producto", payload);
  // Solo validamos que el envelope ApiResponse indique éxito.
  const response = validateApiResponse<void>(data);
  invalidateBotinesInventoryCache();
  return response;
}


/** Consulta las tallas disponibles para un modelo. */
export async function consultaDatosModelosTallasApi(
  paramsValue: ModelparamsConsultaDatosModelosTallas,
): Promise<ConsultaDatosModelosTallasResponse> {
  const cacheKey = `${paramsValue.id}:${paramsValue.modelo.toUpperCase()}`;
  const cached = stockDetailCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.data;

  const pending = stockDetailRequests.get(cacheKey);
  if (pending) return pending;

  const request = apiClient
    .get("api/botines-milas/get-producto-by-id", { params: paramsValue })
    .then(({ data }) => {
      const response =
        validateApiResponse<ConsultaDatosModelosTallasResponse>(data);
      stockDetailCache.set(cacheKey, {
        data: response,
        expiresAt: Date.now() + INVENTORY_CACHE_TTL_MS,
      });
      return response;
    })
    .finally(() => {
      stockDetailRequests.delete(cacheKey);
    });
  stockDetailRequests.set(cacheKey, request);
  return request;
}