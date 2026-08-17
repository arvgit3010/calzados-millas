import { useDashboardPage } from "../hooks/useDashboardPage";
import { DashboardPageView } from "./DashboardPage.view";

/** Contenedor smart (patrón Container/View). */
export function DashboardPage() {
  const page = useDashboardPage();
  return <DashboardPageView {...page} />;
}
