import { useRef, useState, useEffect, useCallback } from "react";
import { Bell } from "lucide-react";
import { useStockAlerts } from "../../hooks/useStockAlerts";
import type { StockRow } from "../../types";
import type { DashboardAlertaStock } from "@/features/dashboard/models/dashboard.model";

type Props = {
  /** Compat: ya no se usa; las alertas vienen de la API. */
  rows?: StockRow[];
};

function nivelLabel(nivel: DashboardAlertaStock["nivel"]) {
  if (nivel === "agotado") return "Agotado";
  if (nivel === "critico") return "Crítico";
  return "Bajo";
}

function nivelBadgeClass(nivel: DashboardAlertaStock["nivel"]) {
  if (nivel === "agotado") return "bg-[#EF4444]";
  if (nivel === "critico") return "bg-[#EA580C]";
  return "bg-[#EAB308]";
}

/** Ícono de campana con badge de alertas de stock bajo (API + WebSocket). */
export function StockAlertsBell({ rows: _rows }: Props) {
  const { alerts, totalCount, highestSeverity, loading } = useStockAlerts();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, close]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, close]);

  const badgeColor =
    highestSeverity === "agotado" || highestSeverity === "critico"
      ? "bg-[#EF4444]"
      : highestSeverity === "bajo"
        ? "bg-[#EAB308]"
        : "bg-[#867275]";

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={toggle}
        className="relative rounded-lg p-2 text-[#544245] transition-all hover:bg-[#F5DCE9]/50 hover:text-[#984258]"
        aria-label="Alertas de stock"
        aria-expanded={isOpen}
      >
        <Bell size={20} />
        {totalCount > 0 && (
          <span
            className={`absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold leading-none text-white ${badgeColor}`}
          >
            {totalCount > 9 ? "9+" : totalCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute top-full right-0 z-50 mt-2 w-[22rem] overflow-hidden rounded-2xl border border-[#E5E7EB] bg-[#FFF7F9] shadow-lg"
          role="menu"
        >
          <div className="border-b border-[#E5E7EB] px-4 py-3">
            <p className="text-[13px] font-bold text-[#251721]">
              Stock bajo ({totalCount})
            </p>
            <p className="text-[11px] text-[#867275]">
              Productos con 3 pares o menos
            </p>
          </div>

          {loading && alerts.length === 0 ? (
            <div className="px-4 py-8 text-center text-[13px] text-[#867275]">
              Cargando alertas…
            </div>
          ) : alerts.length === 0 ? (
            <div className="px-4 py-8 text-center text-[13px] text-[#867275]">
              No hay alertas de stock
            </div>
          ) : (
            <div className="custom-scrollbar max-h-[360px] space-y-2 overflow-y-auto p-3">
              {alerts.map((a) => (
                <div
                  key={a.idProducto}
                  className="rounded-xl border border-[#E5E7EB] bg-white p-3"
                >
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-semibold leading-tight text-[#251721]">
                        {a.modelo || a.sku}
                      </p>
                      <p className="mt-0.5 text-[11px] text-[#867275]">
                        {a.codigoTipo === "SANDALIAS" ? "Sandalias" : "Botines"}
                        {a.color && a.color !== "-" ? ` · ${a.color}` : ""}
                        {a.talla && a.talla !== "-" ? ` · Talla ${a.talla}` : ""}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold text-white ${nivelBadgeClass(a.nivel)}`}
                    >
                      {nivelLabel(a.nivel)}
                    </span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#544245]">
                    <span className="truncate font-mono text-[#64748B]">
                      SKU {a.sku}
                    </span>
                    <span className="font-bold text-[#0F172A]">
                      {a.stockActual} {a.stockActual === 1 ? "par" : "pares"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
