import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/core";
import type {
  ReporteCatalogo,
  ReporteCodigo,
  ReporteFiltro,
  ReportePeriodo,
  ReporteTabla,
} from "../models/reportes.model";
import {
  downloadBase64File,
  downloadCsvFile,
  exportarExcelReposicionApi,
  exportarReporteCsvApi,
  getReporteDetalleApi,
  getReportesCatalogoApi,
} from "../services/reportes.service";

const EMPTY_CATALOGO: ReporteCatalogo = {
  rango: { etiqueta: "" },
  reportes: [],
  totales: {
    ventasMonto: 0,
    ventasPares: 0,
    ventasCantidad: 0,
    comprasMonto: 0,
    comprasPares: 0,
    stockPares: 0,
    capitalEnStock: 0,
    paresPrecioLista: 0,
    paresPrecioRebaja: 0,
  },
};

export function useReportesPage() {
  const [periodo, setPeriodo] = useState<ReportePeriodo>("mes");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [idTipoCalzado, setIdTipoCalzado] = useState<number | "">("");
  const [codigo, setCodigo] = useState<ReporteCodigo>("reposicion");
  const [catalogo, setCatalogo] = useState<ReporteCatalogo>(EMPTY_CATALOGO);
  const [detalle, setDetalle] = useState<ReporteTabla | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const buildFiltro = useCallback((): ReporteFiltro => {
    const filtro: ReporteFiltro = {
      periodo,
      limit: 200,
      stockMax: 3,
      stockObjetivo: 6,
    };
    if (periodo === "custom") {
      if (desde) filtro.desde = desde;
      if (hasta) filtro.hasta = hasta;
    }
    if (idTipoCalzado !== "") filtro.idTipoCalzado = Number(idTipoCalzado);
    return filtro;
  }, [periodo, desde, hasta, idTipoCalzado]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const filtro = buildFiltro();
      const [cat, det] = await Promise.all([
        getReportesCatalogoApi(filtro),
        getReporteDetalleApi(codigo, filtro),
      ]);
      setCatalogo(cat);
      setDetalle(det);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "No se pudo cargar el reporte"));
    } finally {
      setLoading(false);
    }
  }, [buildFiltro, codigo]);

  useEffect(() => {
    void load();
  }, [load]);

  const exportarCsv = async () => {
    setExporting(true);
    try {
      const file = await exportarReporteCsvApi(codigo, buildFiltro());
      downloadCsvFile(file.filename, file.csv);
      toast.success("CSV descargado");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "No se pudo exportar el CSV"));
    } finally {
      setExporting(false);
    }
  };

  const exportarExcel = async () => {
    setExporting(true);
    try {
      const file = await exportarExcelReposicionApi(buildFiltro());
      downloadBase64File(file.filename, file.base64, file.mimeType);
      toast.success("Excel descargado");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "No se pudo exportar el Excel"));
    } finally {
      setExporting(false);
    }
  };

  return {
    title: "Reportes",
    periodo,
    setPeriodo,
    desde,
    setDesde,
    hasta,
    setHasta,
    idTipoCalzado,
    setIdTipoCalzado,
    codigo,
    setCodigo,
    catalogo,
    detalle,
    loading,
    exporting,
    load,
    exportarCsv,
    exportarExcel,
  };
}

export type ReportesPageLogic = ReturnType<typeof useReportesPage>;
