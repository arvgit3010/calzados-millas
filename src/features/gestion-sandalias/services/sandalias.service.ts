import { apiClient, validateApiResponse } from "@/core";
import type {
  ConsultaDatosModelosTallasResponse,
  CrearBotinProductoRequest,
  ModelparamsConsultaDatosModelosTallas,
  ModelSeachParams,
} from "@/features/gestion-botines/models/botinesInventory.model";
import type {
  GetAllSandaliasInventoryResponse,
  ModelSandalia,
} from "../models/sandaliasInventory.model";

const LOOKUP_CACHE_TTL_MS = 5 * 60_000;
const INVENTORY_CACHE_TTL_MS = 15_000;
const SEARCH_CACHE_TTL_MS = 30_000;

const lookupCache = new Map<string, { data: unknown; expiresAt: number }>();
const lookupRequests = new Map<string, Promise<unknown>>();

let inventoryCache:
  | { data: GetAllSandaliasInventoryResponse[]; expiresAt: number }
  | null = null;
let inventoryRequest: Promise<GetAllSandaliasInventoryResponse[]> | null = null;

const searchCache = new Map<
  string,
  { data: GetAllSandaliasInventoryResponse[]; expiresAt: number }
>();
const searchRequests = new Map<
  string,
  Promise<GetAllSandaliasInventoryResponse[]>
>();

const stockDetailCache = new Map<
  string,
  { data: ConsultaDatosModelosTallasResponse; expiresAt: number }
>();
const stockDetailRequests = new Map<
  string,
  Promise<ConsultaDatosModelosTallasResponse>
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

export function invalidateSandaliasInventoryCache(): void {
  inventoryCache = null;
  stockDetailCache.clear();
  searchCache.clear();
}

/** GET modelos de sandalias. */
export async function getSandaliasModelosApi(): Promise<ModelSandalia[]> {
  return getCachedLookup<ModelSandalia[]>(
    "api/sandalias-milas/get-modelos-sandalias",
  );
}

/** GET inventario sandalias (solo id_tipo_calzado = SANDALIAS). */
export async function getSandaliasInventoryProducts(): Promise<
  GetAllSandaliasInventoryResponse[]
> {
  if (inventoryCache && inventoryCache.expiresAt > Date.now()) {
    return inventoryCache.data;
  }
  if (inventoryRequest) return inventoryRequest;

  inventoryRequest = apiClient
    .get("api/sandalias-milas/get-productos")
    .then(({ data }) => {
      const products =
        validateApiResponse<GetAllSandaliasInventoryResponse[]>(data);
      inventoryCache = {
        data: products,
        expiresAt: Date.now() + INVENTORY_CACHE_TTL_MS,
      };
      return products;
    })
    .catch((error) => {
      const status = error?.response?.status;
      if (status === 404) return [];
      throw error;
    })
    .finally(() => {
      inventoryRequest = null;
    });

  return inventoryRequest;
}

/** Busca sandalias vía search-producto. */
export async function searchSandaliasInventoryProduct(
  search: ModelSeachParams,
): Promise<GetAllSandaliasInventoryResponse[]> {
  const cacheKey = search.inputDescriptionSearch.trim().toUpperCase();
  const cached = searchCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  const pending = searchRequests.get(cacheKey);
  if (pending) return pending;

  const request = apiClient
    .get("api/sandalias-milas/search-producto", { params: search })
    .then(({ data }) => {
      const products =
        validateApiResponse<GetAllSandaliasInventoryResponse[]>(data);
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

/** Detalle de stock por modelo (colores/tallas) para ventas. */
export async function consultaDatosModelosTallasSandaliasApi(
  paramsValue: ModelparamsConsultaDatosModelosTallas,
): Promise<ConsultaDatosModelosTallasResponse> {
  const cacheKey = `${paramsValue.id}:${paramsValue.modelo.toUpperCase()}`;
  const cached = stockDetailCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.data;

  const pending = stockDetailRequests.get(cacheKey);
  if (pending) return pending;

  const request = apiClient
    .get("api/sandalias-milas/get-producto-by-id", { params: paramsValue })
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

/** POST crear sandalia / lote. */
export async function createSandaliaProductoApi(
  payload: CrearBotinProductoRequest,
): Promise<void> {
  const { data } = await apiClient.post(
    "api/sandalias-milas/create-producto",
    payload,
  );
  validateApiResponse<void>(data);
  invalidateSandaliasInventoryCache();
}
