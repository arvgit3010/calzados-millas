// import type { StockRow } from "@/shared/panel";
// import { PRODUCT_PLACEHOLDER_IMAGE } from "@/shared/panel/constants";

/** Datos mock del inventario de botines.
 *  totalPairs se mantiene manualmente — si se edita sizeN.qty,
 *  debe actualizarse también totalPairs para mantener consistencia.
 *  size3.qty = 0 indica que esa talla no está disponible para el producto. */
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
  /** Opcional: el API aún no lo envía; la grilla lo muestra con placeholder. */
  imagen?: string | null;
};


export type BotinColorApi = {
  id_color: number;
  desc_color: string;
  activo: boolean;
};

 export  type ModelBotin= {
  id_modelo: number;
  codigo_model: string;
  descModelBotines:string;
  nombre_model:string;
};

 export type ModelTalla= {
  id_talla: number;
  desc_talla: string;
 }

   export  type  ModelSeachParams = {
    codigo: string;
    modelo: string;
    talla: string;
    sku: string
   };


