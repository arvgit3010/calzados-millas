import { useCallback, useState } from "react";
// import { PRODUCT_PLACEHOLDER_IMAGE } from "../constants";
import type { AddProductFormData, StockRow } from "../types";

function toStockRow(id: number, data: AddProductFormData, existing?: StockRow): StockRow {
  // El formulario tiene 5 tallas (35–39); StockRow guarda 3. Usamos 36, 37 y 38.
  const size1 = data.pares[1] ?? { talla: 36, cantidad: 0 };
  const size2 = data.pares[2] ?? { talla: 37, cantidad: 0 };
  const size3 = data.pares[3] ?? { talla: 38, cantidad: 0 };
  const totalPairs = size1.cantidad + size2.cantidad + size3.cantidad;

  return {
    id,
    model: data.modelo,
    color: data.color,
    size1: { size: size1.talla, qty: size1.cantidad },
    size2: { size: size2.talla, qty: size2.cantidad },
    size3: { size: size3.talla, qty: size3.cantidad },
    totalPairs,
    season: data.temporada,
    status: existing?.status ?? "Activo",
    image: existing?.image ?? "",
    provider: existing?.provider ?? "Calzados Mila SAC",
    soldTotal: existing?.soldTotal ?? 0,
  };
}

/** CRUD genérico de inventario. El feature inyecta el loader de datos. */
export function useInventoryCrud(loadInitial: () => StockRow[]) {
  const [rows, setRows] = useState<StockRow[]>(() => []);
  const [nextId, setNextId] = useState(() => {
    const initial = loadInitial();
    return initial.length + 1;
  });

  const add = useCallback(
    (data: AddProductFormData) => {
      setRows((prev) => [...prev, toStockRow(nextId, data)]);
      setNextId((id) => id + 1);
    },
    [nextId],
  );

  const update = useCallback((id: number, data: AddProductFormData) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? toStockRow(id, data, row) : row)),
    );
  }, []);

  const remove = useCallback((id: number) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
  }, []);

  return { rows, add, update, remove };
}
