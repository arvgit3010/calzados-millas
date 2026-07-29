import { useGestionVentasPage } from "../hooks/useGestionVentasPage";
import { GestionVentasPageView } from "./GestionVentasPage.view";

/** Contenedor smart: conecta el hook con la vista de ventas. */
export function GestionVentasPage() {
  const page = useGestionVentasPage();
  return <GestionVentasPageView {...page} />;
}
