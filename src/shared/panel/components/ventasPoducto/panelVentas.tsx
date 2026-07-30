import type { GetAllBotinesInventoryResponse } from "@/features/gestion-botines/models/botinesInventory.model";
import { PanelVentasView } from "./panelVentas.view";

type PanelVentasProps = {
  product: GetAllBotinesInventoryResponse | null;
};

export function PanelVentas({ product }: PanelVentasProps) {
  return <PanelVentasView initialProduct={product} />;
}
