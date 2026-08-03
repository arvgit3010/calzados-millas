export type GetAllBotinesInventoryResponse = {
  id_producto: number;
  idModelo: number;
  descripcionModelo: string;
  nombreModelo: string;
  codigoModelo: string;
  idColor: number;
  descripcionColor: string;
  id_talla: number;
  descripcionTalla: string;
  sku: string;
  stock_actual: number;
  precio_compra_par: string;
  precio_venta_par: string;
  pro_observacion: string;
  usuario_id: number;
  fecha_registro: string;
  fecha_actualizacion: string;
  imagen?: string | null;
};

export type BotinColorApi = {
  id_color: number;
  desc_color: string;
  activo: boolean;
};

export type ModelBotin = {
  id_model: number;
  codigo_model: string;
  descModelBotines: string;
  nombre_model: string;
};

export type ModelTalla = {
  id_talla: number;
  desc_talla: string;
};

export type ModelSeachParams = {
  inputDescriptionSearch: string;
};

export type ModelRango = {
  id_rango: number;
  descripcion: string;
};

export type ModelTipoLote = {
  id_tipo: number;
  descripcion: string;
};

/** Payload para crear un nuevo producto/lote de botines. */
export type CrearBotinProductoRequest = {
  idModelo: number;
  idColor: number;
  idTipoLote: number;
  idRango: number;
  precioCompraPar: number;
  precioVentaPar: number;
  cantidadLotes: number;
  detalleTallas: {
    idTalla: number;
    cantidad: number;
  }[];
};

export type ModelparamsConsultaDatosModelosTallas = {
  id: number;
  modelo: string;
};

export type DetalleModeloStockItem = {
  idProducto: number;
  idModelo: number;
  codigoModelo: string;
  nombreModelo: string;
  idColor: number;
  descripcionColor: string;
  descripcionTalla: string;
  sku: string;
  stock_actual: number;
  observacion: string;
};

export type SaleStockVariant = DetalleModeloStockItem;

export type ConsultaDatosModelosTallasResponse = GetAllBotinesInventoryResponse & {
  DetalleModeloStock: DetalleModeloStockItem[];
};

export type GroupedStockDetails = Record<
  number,
  {
    colorName: string;
    sizes: Record<string, SaleStockVariant>;
  }
>;
