import { useAddProductModal } from "../../hooks/useAddProductModal";
import type { AddProductFormData, StockRow } from "../../types";
import { AddProductModalView } from "./AddProductModal.view";

export type { AddProductFormData };

type AddProductModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddProductFormData) => void | Promise<void>;
  editingRow?: StockRow;
};
 

 type GridRow = {
  id: number;
  sku: string;
  modelo: string;
  color: string;
  talla1: number;
  talla2: number;
  talla3: number;
 }

/** Contenedor smart: conecta useAddProductModal con la vista pura. */
export function AddProductModal(props: AddProductModalProps) {
  const modal = useAddProductModal(props);
  return <AddProductModalView {...modal} />;
}
