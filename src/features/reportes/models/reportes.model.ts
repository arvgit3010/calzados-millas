export type ReportePeriodo =
  | "hoy"
  | "ayer"
  | "semana"
  | "mes"
  | "anio"
  | "custom";

export type ReporteCodigo =
  | "ventas"
  | "compras"
  | "inventario"
  | "ganancias"
  | "pares-por-precio"
  | "reposicion";

export type ReporteFiltro = {
  periodo?: ReportePeriodo;
  desde?: string;
  hasta?: string;
  idTipoCalzado?: number;
  limit?: number;
  stockMax?: number;
  stockObjetivo?: number;
};

export type ReporteRango = {
  desde?: string;
  hasta?: string;
  periodo?: string;
  etiqueta?: string;
};

export type ReporteCatalogoItem = {
  codigo: ReporteCodigo;
  nombre: string;
  descripcion: string;
};

export type ReporteCatalogo = {
  rango: ReporteRango;
  reportes: ReporteCatalogoItem[];
  totales: {
    ventasMonto: number;
    ventasPares: number;
    ventasCantidad: number;
    comprasMonto: number;
    comprasPares: number;
    stockPares: number;
    capitalEnStock: number;
    paresPrecioLista: number;
    paresPrecioRebaja: number;
  };
};

export type ReporteTabla = {
  rango: ReporteRango;
  resumen: Record<string, number | string>;
  filas: Array<Record<string, string | number | null>>;
};

export type ReporteCsvExport = {
  filename: string;
  mimeType: string;
  csv: string;
};

export type ReporteExcelExport = {
  filename: string;
  mimeType: string;
  base64: string;
};
