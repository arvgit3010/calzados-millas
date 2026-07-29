import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AddProductFormData, StockRow } from "../types";
import {
  getBotinesInventory,
  searchBotinesInventory,
} from "@/features/gestion-botines/services/botines.service";
import { getApiErrorMessage, ROUTES } from "@/core";
import type { GetAllBotinesInventoryResponse, ModelSeachParams } from "@/features/gestion-botines/models/botinesInventory.model";

export type UseCalzadoPanelArgs = {
  rows: StockRow[];
  inventoryTitle: string;
  onAddProduct?: (data: AddProductFormData) => void;
  onEditProduct?: (id: number, data: AddProductFormData) => void;
  onDeleteProduct?: (id: number) => void;
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
}: UseCalzadoPanelArgs) {
  const navigate = useNavigate();
  const canMutate = !!onAddProduct;

  const [products, setProducts] = useState<GetAllBotinesInventoryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRow, setSelectedRow] = useState<GetAllBotinesInventoryResponse | null>(null);
  const [modalMode, setModalMode] = useState<
    { mode: "add" } | { mode: "edit"; row: StockRow } | null
  >(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const data = await getBotinesInventory();
        if (cancelled) return;
        setProducts(data);
      } catch (error) {
        if (!cancelled) console.error(getApiErrorMessage(error));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSearchChange = async (value: string) => {
    const term = value;
     const searchParams: ModelSeachParams = {
      codigo: term,
      modelo: term,
      talla: term,
      sku: term,
     };
    setSearchTerm(term);

   
    setLoading(true);
    try {
      const data = Object.values(searchParams).some(value => value !== '') ? await searchBotinesInventory(searchParams) : await getBotinesInventory();
      setProducts(data);
    } catch (error) {

      console.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = (data: AddProductFormData) => {
    if (modalMode?.mode === "edit" && onEditProduct) {
      onEditProduct(modalMode.row.id, data);
    } else if (onAddProduct) {
      onAddProduct(data);
    }
    setModalMode(null);
  };

  const handleDeleteConfirm = (id: number) => {
    onDeleteProduct?.(id);
    setDeletingId(null);
    setProducts((prev) => prev.filter((p) => p.id_producto !== id));
  };

  const handleEditProduct = (product: GetAllBotinesInventoryResponse) => {
    setModalMode({ mode: "edit", row: toStockRow(product) });
  };

  const handleVender = (product: GetAllBotinesInventoryResponse) => {
    navigate(ROUTES.gestionVentas, { state: { product } });
  };

  return {
    displayTitle: inventoryTitle,
    canMutate,
    products,
    loading,
    searchTerm,
    selectedRow,
    deletingId,
    modalMode,
    setSelectedRow,
    setModalMode,
    setDeletingId,
    handleAddSubmit,
    handleDeleteConfirm,
    handleEditProduct,
    handleVender,
    handleSearchChange,
  };
}

export type CalzadoPanelViewProps = ReturnType<typeof useCalzadoPanel>;
