import type {
  GetAllBotinesInventoryResponse,
  GroupedStockDetails,
} from "@/features/gestion-botines/models/botinesInventory.model";
import { PanelVentasView } from "./panelVentas.view";

type PanelVentasProps = {
  product: GetAllBotinesInventoryResponse | null;
  loadingStock: boolean;
  groupedStockDetails: GroupedStockDetails;
  selectedColorId: number | null;
  setSelectedColorId: (id: number) => void;
  selectedSize: string | null;
  setSelectedSize: (size: string | null) => void;
  loadProductStock: (product: GetAllBotinesInventoryResponse) => Promise<boolean>;
};

export function PanelVentas({
  product,
  loadingStock,
  groupedStockDetails,
  selectedColorId,
  setSelectedColorId,
  selectedSize,
  setSelectedSize,
  loadProductStock,
}: PanelVentasProps) {
  return (
    <PanelVentasView
      initialProduct={product}
      loadingStock={loadingStock}
      groupedStockDetails={groupedStockDetails}
      selectedColorId={selectedColorId}
      setSelectedColorId={setSelectedColorId}
      selectedSize={selectedSize}
      setSelectedSize={setSelectedSize}
      loadProductStock={loadProductStock}
    />
  );
}
