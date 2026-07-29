import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ROUTES } from "@/core";
import { GestionBotinesPage } from "@/features/gestion-botines";
import { GestionSandaliasPage } from "@/features/gestion-sandalias";
import { GestionVentasPage } from "@/features/gestion-ventas";
import { IniciarSesionPage } from "@/features/iniciar-sesion";
import { LandingPage } from "@/features/landing";

const EcommercePage = lazy(() =>
  import("@/features/ecommerce").then((m) => ({ default: m.EcommercePage }))
);

export function AppRouter() {
  return (
    <Routes>
      <Route path={ROUTES.home} element={<LandingPage />} />
      <Route path={ROUTES.iniciarSession} element={<IniciarSesionPage />} />
      <Route path={ROUTES.ecommerce} element={<EcommercePage />} />

      <Route>
        <Route path={ROUTES.gestionSandalias} element={<GestionSandaliasPage />} />
        <Route path={ROUTES.gestionBotines} element={<GestionBotinesPage />} />
        <Route path={ROUTES.gestionVentas} element={<GestionVentasPage />} />
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
    </Routes>
  );
}
