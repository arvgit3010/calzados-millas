import { useAddProductModal } from "../../hooks/useAddProductModal";
import type { AddProductFormData, InventorySection, StockRow } from "../../types";
import { AddProductModalView } from "./AddProductModal.view";

export type { AddProductFormData };

type AddProductModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddProductFormData) => void | Promise<void>;
  onCreated?: () => void | Promise<void>;
  editingRow?: StockRow;
  section?: InventorySection;
};

/** Contenedor smart: conecta useAddProductModal con la vista pura. */
export function AddProductModal(props: AddProductModalProps) {
  const modal = useAddProductModal(props);
  return <AddProductModalView {...modal} />;
}
