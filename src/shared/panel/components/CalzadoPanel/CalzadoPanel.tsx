import { useCalzadoPanel } from "../../hooks/useCalzadoPanel";
import type { AddProductFormData, StockRow } from "../../types";
import type { GetAllBotinesInventoryResponse } from "@/features/gestion-botines/models/botinesInventory.model";
import { CalzadoPanelView } from "./CalzadoPanel.view";

type CalzadoPanelProps = {
  rows: StockRow[];
  inventoryTitle: string;
  onAddProduct?: (data: AddProductFormData) => void;
  onEditProduct?: (id: number, data: AddProductFormData) => void;
  onDeleteProduct?: (id: number) => void;
   /** Cuando se usa como selector, notifica el producto seleccionado sin navegar. */
  onVenderProduct?: (product: GetAllBotinesInventoryResponse) => void;
};

/** Contenedor smart: conecta useCalzadoPanel con la vista pura. */
export function CalzadoPanel(props: CalzadoPanelProps) {
  const panel = useCalzadoPanel(props);
  return <CalzadoPanelView {...panel} />;
}
