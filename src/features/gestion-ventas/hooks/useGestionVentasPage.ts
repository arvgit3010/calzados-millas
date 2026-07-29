import { useLocation } from "react-router-dom";
import type { GetAllBotinesInventoryResponse } from "@/features/gestion-botines/models/botinesInventory.model";

export type GestionVentasLocationState = {
  product?: GetAllBotinesInventoryResponse;
};

export function useGestionVentasPage() {
  const location = useLocation();
  const state = (location.state as GestionVentasLocationState | null) ?? null;

  return {
    product: state?.product ?? null,
  };
}

export type GestionVentasPageViewProps = ReturnType<typeof useGestionVentasPage>;
