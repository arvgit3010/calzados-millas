export type ModelSandalia = {
  id_model: number;
  codigo_model: string;
  descModelSandalias: string;
  nombre_model: string;
};

/** Misma forma que botines para reutilizar el panel. */
export type GetAllSandaliasInventoryResponse = {
  id_producto: number;
  idTipoCalzado?: number;
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
