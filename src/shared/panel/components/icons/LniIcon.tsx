type LniIconProps = {
  /** Nombre del icono Lineicons sin prefijo `lni-` (ej. `dashboard-square-1`). */
  name: string;
  size?: number;
  className?: string;
  title?: string;
};

/**
 * Icono Lineicons (CDN free: https://lineicons.com/icons).
 * Requiere el CSS de Lineicons cargado en index.html.
 */
export function LniIcon({ name, size = 18, className = "", title }: LniIconProps) {
  return (
    <i
      className={`lni lni-${name} ${className}`.trim()}
      style={{ fontSize: size, lineHeight: 1, display: "inline-flex" }}
      aria-hidden={title ? undefined : true}
      title={title}
      role={title ? "img" : undefined}
    />
  );
}

/** Iconos del panel Millas (nombres oficiales Lineicons free). */
export const Lni = {
  dashboard: "dashboard-square-1",
  reportes: "files",
  /** Verano / calzado abierto — free no trae sandalia específica */
  sandalias: "sun-1",
  /** Único icono free relacionado a calzado */
  botines: "nike",
  registrar: "file-plus-circle",
  ayuda: "question-mark-circle",
  logout: "exit",
  stock: "box-closed",
  capital: "wallet-1",
  ganancia: "trend-up-1",
  alerta: "bell-1",
  compras: "cart-2",
} as const;
