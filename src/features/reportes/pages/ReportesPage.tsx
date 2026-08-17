import { useReportesPage } from "../hooks/useReportesPage";
import { ReportesPageView } from "./ReportesPage.view";

/** Contenedor smart (patrón Container/View). */
export function ReportesPage() {
  const page = useReportesPage();
  return <ReportesPageView {...page} />;
}
