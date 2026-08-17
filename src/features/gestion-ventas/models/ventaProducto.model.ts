export type VentaProductoItemRequest = {
  idProducto: number;
  cantidad: number;
  precioVenta: number;
  observacion: string;
};

export type CrearVentaProductoRequest = {
  nombreCliente: string;
  dni: string;
  telefono: string;
  distrito: string;
  provincia: string;
  direccion: string;
  /** UUID del usuario autenticado (`users.id`). */
  usuarioId: string;
  items: VentaProductoItemRequest[];
};

export type CrearVentaProductoResponse = {
  mensaje: string;
  venta: {
    id_venta: number;
  };
};

export type ImprimirEtiquetaVentaRequest = {
  idVenta: number;
  printerName?: string;
};

export type ImprimirEtiquetaVentaResponse = {
  message: string;
  idVenta: number;
  printer: string;
  formato: string;
};
