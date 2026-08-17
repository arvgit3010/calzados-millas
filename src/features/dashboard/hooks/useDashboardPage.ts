import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/core";
import { dashboardSocket } from "@/core/socket/dashboardSocket";
import type {
  DashboardFiltro,
  DashboardMetricas,
  DashboardPeriodo,
} from "../models/dashboard.model";
import { getDashboardMetricasApi } from "../services/dashboard.service";

const EMPTY_METRICAS: DashboardMetricas = {
  rango: {
    desde: "",
    hasta: "",
    periodo: "mes",
    etiqueta: "Este mes",
  },
  inventario: {
    productosActivos: 0,
    stockTotal: 0,
    stockBajo: 0,
    stockAgotado: 0,
  },
  financiero: {
    capitalEnStock: 0,
    comprasPeriodo: 0,
    ventasPeriodo: 0,
    costoVentasPeriodo: 0,
    gananciaPeriodo: 0,
    gananciaPorPar: 0,
    ticketPromedio: 0,
    dineroInvertido: 0,
    dineroGanado: 0,
    utilidadEstimada: 0,
  },
  ventas: {
    cantidadVentas: 0,
    paresVendidos: 0,
    paresPrecioLista: 0,
    paresPrecioRebaja: 0,
    mejorDia: null,
    peorDia: null,
  },
  porTipo: [],
  serieDiaria: [],
  topVendidos: [],
  alertasStock: [],
  resumenRapido: {
    ventasHoy: 0,
    montoHoy: 0,
    ventasSemana: 0,
    montoSemana: 0,
    ventasMes: 0,
    montoMes: 0,
  },
};

export function useDashboardPage() {
  const [metricas, setMetricas] = useState<DashboardMetricas>(EMPTY_METRICAS);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState<DashboardPeriodo>("mes");
  const [idTipoCalzado, setIdTipoCalzado] = useState<number | undefined>();
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  const loadMetricas = useCallback(async () => {
    setLoading(true);
    try {
      const filtro: DashboardFiltro = {
        periodo,
        idTipoCalzado,
        limit: 8,
      };
      if (periodo === "custom") {
        if (!desde || !hasta) {
          toast.error("Selecciona rango de fechas (desde / hasta)");
          setLoading(false);
          return;
        }
        filtro.desde = desde;
        filtro.hasta = hasta;
      }
      const data = await getDashboardMetricasApi(filtro);
      setMetricas(data);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
      setMetricas(EMPTY_METRICAS);
    } finally {
      setLoading(false);
    }
  }, [periodo, idTipoCalzado, desde, hasta]);

  useEffect(() => {
    void loadMetricas();
  }, [loadMetricas]);

  useEffect(() => {
    dashboardSocket.connect();

    const onRefresh = () => {
      void loadMetricas();
    };

    dashboardSocket.on("dashboard-refresh", onRefresh);
    return () => {
      dashboardSocket.off("dashboard-refresh", onRefresh);
    };
  }, [loadMetricas]);

  return {
    title: "Panel",
    metricas,
    loading,
    periodo,
    setPeriodo,
    idTipoCalzado,
    setIdTipoCalzado,
    desde,
    setDesde,
    hasta,
    setHasta,
    refresh: loadMetricas,
  };
}

export type DashboardPageLogic = ReturnType<typeof useDashboardPage>;
