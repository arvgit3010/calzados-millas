export type DashboardPeriodo =
  | "hoy"
  | "ayer"
  | "semana"
  | "mes"
  | "anio"
  | "custom";

export type DashboardFiltro = {
  periodo?: DashboardPeriodo;
  desde?: string;
  hasta?: string;
  idTipoCalzado?: number;
  limit?: number;
};

export type DashboardTipoResumen = {
  idTipoCalzado: number;
  codigo: string;
  productosActivos: number;
  stockTotal: number;
  stockBajo: number;
  stockAgotado?: number;
  inversion?: number;
  ventasMonto?: number;
  ventasCantidad?: number;
  paresVendidos?: number;
};

/** Compat con get-resumen legacy */
export type DashboardResumen = {
  productosActivos: number;
  stockTotal: number;
  stockBajo: number;
  ventasHoy: number;
  montoHoy: number;
  ventasMes: number;
  montoMes: number;
  porTipo: DashboardTipoResumen[];
};

export type DashboardDiaSerie = {
  fecha: string;
  ventas: number;
  monto: number;
  pares: number;
  botinesMonto: number;
  sandaliasMonto: number;
  botinesPares: number;
  sandaliasPares: number;
  botinesVentas: number;
  sandaliasVentas: number;
};

export type DashboardTopVendido = {
  idProducto: number;
  sku: string;
  idTipoCalzado: number;
  codigoTipo: string;
  idModelo: number;
  paresVendidos: number;
  monto: number;
};

export type DashboardAlertaStock = {
  idProducto: number;
  sku: string;
  idTipoCalzado: number;
  codigoTipo: string;
  modelo?: string;
  color?: string;
  talla?: string;
  stockActual: number;
  nivel: "bajo" | "critico" | "agotado";
  precioVentaPar: number;
};

export type DashboardMetricas = {
  rango: {
    desde: string;
    hasta: string;
    periodo: DashboardPeriodo;
    etiqueta: string;
  };
  inventario: {
    productosActivos: number;
    stockTotal: number;
    stockBajo: number;
    stockAgotado: number;
  };
  financiero: {
    capitalEnStock: number;
    comprasPeriodo: number;
    ventasPeriodo: number;
    costoVentasPeriodo: number;
    gananciaPeriodo: number;
    gananciaPorPar: number;
    ticketPromedio: number;
    /** Compat */
    dineroInvertido: number;
    dineroGanado: number;
    utilidadEstimada: number;
  };
  ventas: {
    cantidadVentas: number;
    paresVendidos: number;
    /** Pares a precio lista (~S/75) */
    paresPrecioLista: number;
    /** Pares en rebaja (~S/59) */
    paresPrecioRebaja: number;
    mejorDia: DashboardDiaSerie | null;
    peorDia: DashboardDiaSerie | null;
  };
  porTipo: DashboardTipoResumen[];
  serieDiaria: DashboardDiaSerie[];
  topVendidos: DashboardTopVendido[];
  alertasStock: DashboardAlertaStock[];
  resumenRapido: {
    ventasHoy: number;
    montoHoy: number;
    ventasSemana: number;
    montoSemana: number;
    ventasMes: number;
    montoMes: number;
  };
};

export type DashboardRefreshPayload = {
  motivo: "venta" | "compra" | "stock" | "manual";
  timestamp: string;
};
