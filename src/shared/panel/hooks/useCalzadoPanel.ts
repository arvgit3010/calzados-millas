// import { Response } from './../../../features/gestion-botines/models/botinesInventory.model';
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AddProductFormData, StockRow } from "../types";
import {
  getBotinesInventoryProducts,
  searchBotinesInventoryProduct,
} from "@/features/gestion-botines/services/botines.service";
import {
  botinesSocket,
  getApiErrorMessage,
  ROUTES,
  type BotinesStockUpdate,
} from "@/core";
import type {
  GetAllBotinesInventoryResponse,
} from "@/features/gestion-botines/models/botinesInventory.model";

export type UseCalzadoPanelArgs = {
  rows?: StockRow[];
  inventoryTitle: string;
  onAddProduct?: (data: AddProductFormData) => void;
  onEditProduct?: (id: number, data: AddProductFormData) => void;
  onDeleteProduct?: (id: number) => void;
  /** Opcional: en lugar de navegar, notifica el producto seleccionado (modo "selector"). */
  onVenderProduct?: (product: GetAllBotinesInventoryResponse) => void;
};

type CompraRealizadaPayload = {
  productos?: BotinesStockUpdate[];
};

function toStockRow(product: GetAllBotinesInventoryResponse): StockRow {
  const talla = Number(product.descripcionTalla) || 0;
  return {
    id: product.id_producto,
    model: product.nombreModelo,
    color: product.descripcionColor,
    size1: { size: talla, qty: product.stock_actual },
    size2: { size: 0, qty: 0 },
    size3: { size: 0, qty: 0 },
    totalPairs: product.stock_actual,
    season: "",
    status: "Activo",
    image: product.imagen ?? undefined,
  };
}

export function useCalzadoPanel({
  inventoryTitle,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onVenderProduct,
}: UseCalzadoPanelArgs) {
  const navigate = useNavigate();
  const canMutate = !!onAddProduct;

  const [products, setProducts] = useState<GetAllBotinesInventoryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchTermRef = useRef(searchTerm);
  searchTermRef.current = searchTerm;
  const productsRef = useRef(products);
  productsRef.current = products;

  const [selectedRow, setSelectedRow] = useState<GetAllBotinesInventoryResponse | null>(null);
  const [modalMode, setModalMode] = useState<
    { mode: "add" } | { mode: "edit"; row: StockRow } | null
  >(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const isSelectorMode = !!onVenderProduct;
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    let cancelled = false;
    const trimmed = searchTerm.trim();
    const delay = trimmed.length >= 2 ? 400 : 0;

    const timeoutId = window.setTimeout(async () => {
      if (trimmed.length === 1) return;

      setLoading(true);
      try {
        const data = trimmed.length >= 2
          ? await searchBotinesInventoryProduct({
              inputDescriptionSearch: trimmed,
            })
          : await getBotinesInventoryProducts();
        if (cancelled) return;
        setProducts(data);
        setPage(1);
      } catch (error) {
        if (!cancelled) console.error(getApiErrorMessage(error));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, delay);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [searchTerm]);

  useEffect(() => {
    const handleStockUpdate = (updatedProduct: BotinesStockUpdate) => {
      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id_producto === updatedProduct.id_producto ||
          product.sku === updatedProduct.sku
            ? {
                ...product,
                stock_actual: updatedProduct.stock_actual,
                precio_compra_par:
                  updatedProduct.precio_compra_par ?? product.precio_compra_par,
                precio_venta_par:
                  updatedProduct.precio_venta_par ?? product.precio_venta_par,
                pro_observacion:
                  updatedProduct.pro_observacion ?? product.pro_observacion,
                fecha_actualizacion:
                  updatedProduct.fecha_actualizacion ??
                  product.fecha_actualizacion,
              }
            : product,
        ),
      );
    };

    const handleCompraRealizada = async (payload: unknown) => {
      const { productos: updatedProducts = [] } = (payload ?? {}) as CompraRealizadaPayload;
      if (updatedProducts.length > 0) {
        setProducts((currentProducts) => {
          const byId = new Map(
            currentProducts.map((product) => [product.id_producto, product]),
          );
          let changed = false;

          for (const updated of updatedProducts) {
            const existing = byId.get(updated.id_producto);
            if (existing) {
              byId.set(updated.id_producto, {
                ...existing,
                stock_actual: updated.stock_actual,
                precio_compra_par:
                  updated.precio_compra_par ?? existing.precio_compra_par,
                precio_venta_par:
                  updated.precio_venta_par ?? existing.precio_venta_par,
                fecha_actualizacion:
                  updated.fecha_actualizacion ?? existing.fecha_actualizacion,
              });
              changed = true;
            }
          }

          if (changed) {
            return currentProducts.map(
              (product) => byId.get(product.id_producto) ?? product,
            );
          }
          return currentProducts;
        });
      }

      const hasNewProducts = updatedProducts.some(
        (updated) =>
          !productsRef.current.some(
            (product) => product.id_producto === updated.id_producto,
          ),
      );

      if (hasNewProducts || updatedProducts.length === 0) {
        try {
          const term = searchTermRef.current.trim();
          const data =
            term.length >= 2
              ? await searchBotinesInventoryProduct({
                  inputDescriptionSearch: term,
                })
              : await getBotinesInventoryProducts();
          setProducts(data);
          setPage(1);
        } catch (error) {
          console.error(getApiErrorMessage(error));
        }
      }
    };

    botinesSocket.on("stock-update", handleStockUpdate);
    botinesSocket.on("compra-realizada", handleCompraRealizada);

    return () => {
      botinesSocket.off("stock-update", handleStockUpdate);
      botinesSocket.off("compra-realizada", handleCompraRealizada);
    };
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleAddSubmit = (data: AddProductFormData) => {
    if (modalMode?.mode === "edit" && onEditProduct) {
      onEditProduct(modalMode.row.id, data);
    } else if (onAddProduct) {
      onAddProduct(data);
    }
    setModalMode(null);
  };

  const handleProductCreated = () => {
    setSearchTerm("");
    setPage(1);
  };

  const handleDeleteConfirm = (id: number) => {
    onDeleteProduct?.(id);
    setDeletingId(null);
    setProducts((prev) => {
      const next = prev.filter((p) => p.id_producto !== id);
      const totalPages = Math.max(1, Math.ceil(next.length / pageSize));
      if (page > totalPages) setPage(totalPages);
      return next;
    });
  };

  const handleEditProduct = (product: GetAllBotinesInventoryResponse) => {
    setModalMode({ mode: "edit", row: toStockRow(product) });
  };

  const handleVender = (product: GetAllBotinesInventoryResponse) => {
    if (onVenderProduct) {
      onVenderProduct(product);
      return;
    }

    navigate(ROUTES.gestionVentas, { state: { product } });
  };

  const totalPages = Math.max(1, Math.ceil(products.length / pageSize));
  const paginatedProducts = products.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  const goToPage = (newPage: number) => {
    const safePage = Math.min(totalPages, Math.max(1, newPage));
    setPage(safePage);
  };

  const nextPage = () => goToPage(page + 1);
  const prevPage = () => goToPage(page - 1);

  return {
    displayTitle: inventoryTitle,
    canMutate,
    products,
    paginatedProducts,
    page,
    totalPages,
    nextPage,
    prevPage,
    loading,
    searchTerm,
    selectedRow,
    deletingId,
    isSelectorMode,
    modalMode,
    setSelectedRow,
    setModalMode,
    setDeletingId,
    handleAddSubmit,
    handleProductCreated,
    handleDeleteConfirm,
    handleEditProduct,
    handleVender,
    handleSearchChange,
  };
}

export type CalzadoPanelViewProps = ReturnType<typeof useCalzadoPanel>;
