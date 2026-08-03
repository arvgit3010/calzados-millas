import { io, type Socket } from "socket.io-client";
import { API_URL } from "@/core/config/env";

export type BotinesStockUpdate = {
  id_producto: number;
  idModelo: number;
  idColor: number;
  id_talla: number;
  sku: string;
  stock_actual: number;
  precio_compra_par?: string;
  precio_venta_par?: string;
  pro_observacion?: string;
  usuario_id?: number;
  fecha_actualizacion?: string;
};

export type VentaRealizadaResumen = {
  productoId: number;
  cantidadVendida: number;
  stockActual: number;
};

type BotinesServerEvents = {
  "stock-update": (producto: BotinesStockUpdate) => void;
  "compra-realizada": (data: unknown) => void;
  "venta-realizada": (
    data: BotinesStockUpdate | VentaRealizadaResumen,
  ) => void;
  "venta-total-realizada": (data: unknown) => void;
};

const socketBaseUrl = API_URL.replace(/\/+$/, "");

export const botinesSocket: Socket<BotinesServerEvents> = io(
  `${socketBaseUrl}/botines`,
  {
    autoConnect: false,
    transports: ["websocket", "polling"],
  },
);
