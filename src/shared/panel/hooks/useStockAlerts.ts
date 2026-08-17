import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { botinesSocket, dashboardSocket } from "@/core";
import type { DashboardAlertaStock } from "@/features/dashboard/models/dashboard.model";
import { getAlertasStockApi } from "@/features/dashboard/services/dashboard.service";

type StockAlertsResult = {
  alerts: DashboardAlertaStock[];
  totalCount: number;
  highestSeverity: "critico" | "bajo" | "agotado" | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

function nivelRank(nivel: DashboardAlertaStock["nivel"]) {
  if (nivel === "agotado") return 3;
  if (nivel === "critico") return 2;
  return 1;
}

function formatAlertaToast(a: DashboardAlertaStock) {
  const tipo = a.codigoTipo === "SANDALIAS" ? "Sandalias" : "Botines";
  const modelo = a.modelo || a.sku;
  const talla = a.talla ? ` · Talla ${a.talla}` : "";
  const color = a.color && a.color !== "-" ? ` · ${a.color}` : "";
  const nivelLabel =
    a.nivel === "agotado"
      ? "AGOTADO"
      : a.nivel === "critico"
        ? "CRÍTICO"
        : "BAJO";
  return `${nivelLabel}: ${tipo} ${modelo}${talla}${color} — ${a.stockActual} pares (SKU ${a.sku})`;
}

/** Sonido corto de alerta (Web Audio, sin archivo externo). */
function playStockAlertSound() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const beep = (freq: number, start: number, dur: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + start);
      gain.gain.setValueAtTime(0.0001, now + start);
      gain.gain.exponentialRampToValueAtTime(0.12, now + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + start);
      osc.stop(now + start + dur + 0.02);
    };

    beep(784, 0, 0.14);
    beep(988, 0.16, 0.18);

    window.setTimeout(() => {
      void ctx.close();
    }, 500);
  } catch {
    // Sin audio disponible: no bloquear la alerta visual
  }
}

function showStockAlertToast(message: string) {
  toast(message, {
    duration: 5500,
    icon: "⚠️",
    style: {
      background: "#FFFBEB",
      color: "#334155",
      border: "1px solid #FDE68A",
      maxWidth: "28rem",
      fontSize: "13px",
    },
  });
}

/** Carga alertas de stock bajo desde API y se refresca por WebSocket. */
export function useStockAlerts(_rowsIgnored?: unknown): StockAlertsResult {
  const [alerts, setAlerts] = useState<DashboardAlertaStock[]>([]);
  const [loading, setLoading] = useState(true);
  const knownIdsRef = useRef<Set<number>>(new Set());
  const primedRef = useRef(false);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const next = await getAlertasStockApi();
      const nextIds = new Set(next.map((a) => a.idProducto));

      if (primedRef.current) {
        const nuevos = next.filter((a) => !knownIdsRef.current.has(a.idProducto));
        if (nuevos.length > 0) {
          playStockAlertSound();
          for (const a of nuevos.slice(0, 3)) {
            showStockAlertToast(formatAlertaToast(a));
          }
          if (nuevos.length > 3) {
            showStockAlertToast(`+${nuevos.length - 3} alertas de stock más`);
          }
        }
      }

      knownIdsRef.current = nextIds;
      primedRef.current = true;
      setAlerts(next);
    } catch {
      // Silencioso: la campana no debe romper el layout
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const onRefresh = () => {
      void refresh();
    };

    dashboardSocket.connect();
    botinesSocket.on("stock-update", onRefresh);
    botinesSocket.on("venta-total-realizada", onRefresh);
    dashboardSocket.on("dashboard-refresh", onRefresh);

    return () => {
      botinesSocket.off("stock-update", onRefresh);
      botinesSocket.off("venta-total-realizada", onRefresh);
      dashboardSocket.off("dashboard-refresh", onRefresh);
    };
  }, [refresh]);

  const totalCount = alerts.length;

  const highestSeverity: StockAlertsResult["highestSeverity"] = useMemo(() => {
    if (totalCount === 0) return null;
    const max = Math.max(...alerts.map((a) => nivelRank(a.nivel)));
    if (max >= 3) return "agotado";
    if (max >= 2) return "critico";
    return "bajo";
  }, [alerts, totalCount]);

  return { alerts, totalCount, highestSeverity, loading, refresh };
}
