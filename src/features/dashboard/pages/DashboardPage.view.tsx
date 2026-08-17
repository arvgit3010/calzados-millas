import type { ReactNode } from "react";
import { motion } from "motion/react";
import {
  Package,
  RefreshCw,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { InventoryManagementLayout } from "@/shared/panel";
import { Lni, LniIcon } from "@/shared/panel/components/icons/LniIcon";
import { AnimatedNumber } from "../components/AnimatedNumber";
import { DashboardCharts } from "../components/DashboardCharts";
import type { DashboardPeriodo } from "../models/dashboard.model";
import type { DashboardPageLogic } from "../hooks/useDashboardPage";

function formatMoney(value: number) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

type KpiTone = "violet" | "teal" | "rose" | "amber" | "blue" | "emerald" | "orange";

const TONE: Record<KpiTone, { wrap: string; icon: string }> = {
  violet: { wrap: "border-[#DDD6FE] bg-[#F5F3FF]", icon: "bg-[#7C3AED] text-white" },
  teal: { wrap: "border-[#99F6E4] bg-[#F0FDFA]", icon: "bg-[#0D9488] text-white" },
  rose: { wrap: "border-[#FECDD3] bg-[#FFF1F2]", icon: "bg-[#E11D48] text-white" },
  amber: { wrap: "border-[#FDE68A] bg-[#FFFBEB]", icon: "bg-[#D97706] text-white" },
  blue: { wrap: "border-[#BFDBFE] bg-[#EFF6FF]", icon: "bg-[#2563EB] text-white" },
  emerald: { wrap: "border-[#A7F3D0] bg-[#ECFDF5]", icon: "bg-[#059669] text-white" },
  orange: { wrap: "border-[#FED7AA] bg-[#FFF7ED]", icon: "bg-[#EA580C] text-white" },
};

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

function MiniKpi({
  label,
  value,
  hint,
  icon,
  tone,
  index = 0,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon: ReactNode;
  tone: KpiTone;
  index?: number;
}) {
  const t = TONE[tone];
  return (
    <motion.div
      className={`rounded-lg border px-2.5 py-1.5 ${t.wrap}`}
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <div className="flex items-center gap-2">
        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${t.icon}`}>
          {icon}
        </span>
        <div className="min-w-0">
          <p className="font-[Inter,system-ui,sans-serif] text-[10px] font-medium text-[#64748B]">
            {label}
          </p>
          <p className="truncate text-[16px] font-bold leading-tight text-[#0F172A]">{value}</p>
          {hint ? <p className="truncate text-[11px] text-[#94A3B8]">{hint}</p> : null}
        </div>
      </div>
    </motion.div>
  );
}

const PERIODOS: { id: DashboardPeriodo; label: string }[] = [
  { id: "hoy", label: "Hoy" },
  { id: "ayer", label: "Ayer" },
  { id: "semana", label: "Semana" },
  { id: "mes", label: "Mes" },
  { id: "anio", label: "Año" },
  { id: "custom", label: "Rango" },
];

export function DashboardPageView({
  title,
  metricas,
  loading,
  periodo,
  setPeriodo,
  idTipoCalzado,
  setIdTipoCalzado,
  desde,
  setDesde,
  hasta,
  setHasta,
  refresh,
}: DashboardPageLogic) {
  const botines = metricas.porTipo.find((t) => t.codigo === "BOTINES");
  const sandalias = metricas.porTipo.find((t) => t.codigo === "SANDALIAS");
  const r = metricas.resumenRapido;
  const fin = metricas.financiero;
  const f = {
    capitalEnStock: fin.capitalEnStock ?? fin.dineroInvertido ?? 0,
    comprasPeriodo: fin.comprasPeriodo ?? 0,
    ventasPeriodo: fin.ventasPeriodo ?? fin.dineroGanado ?? 0,
    costoVentasPeriodo: fin.costoVentasPeriodo ?? 0,
    gananciaPeriodo: fin.gananciaPeriodo ?? fin.utilidadEstimada ?? 0,
    gananciaPorPar: fin.gananciaPorPar ?? 0,
  };

  return (
    <InventoryManagementLayout title={title} rows={[]} contentScrollable compactTitle>
      <motion.div
        className="space-y-3 pb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        {/* Filtros — siempre arriba */}
        <motion.div
          className="rounded-xl border border-[#E2E8F0] bg-white p-2"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1">
              {PERIODOS.map((p) => (
                <motion.button
                  key={p.id}
                  type="button"
                  onClick={() => setPeriodo(p.id)}
                  whileTap={{ scale: 0.96 }}
                  className={[
                    "cursor-pointer rounded-full border-0 px-2 py-0.5 text-[10px] font-semibold",
                    periodo === p.id
                      ? "bg-[#0F172A] text-white"
                      : "bg-[#F1F5F9] text-[#475569]",
                  ].join(" ")}
                >
                  {p.label}
                </motion.button>
              ))}
            </div>
            <motion.button
              type="button"
              onClick={() => void refresh()}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#0F172A] px-2.5 py-1 text-[11px] font-semibold text-white"
            >
              <RefreshCw size={12} className={loading ? "animate-spin" : undefined} />
              Actualizar
            </motion.button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={idTipoCalzado ?? ""}
              onChange={(e) =>
                setIdTipoCalzado(e.target.value ? Number(e.target.value) : undefined)
              }
              className="rounded-md border border-[#E2E8F0] px-2 py-1 text-[11px]"
            >
              <option value="">Botines + Sandalias</option>
              <option value={1}>Solo botines</option>
              <option value={2}>Solo sandalias</option>
            </select>
            {periodo === "custom" && (
              <>
                <input
                  type="date"
                  value={desde}
                  onChange={(e) => setDesde(e.target.value)}
                  className="rounded-md border border-[#E2E8F0] px-2 py-1 text-[11px]"
                />
                <input
                  type="date"
                  value={hasta}
                  onChange={(e) => setHasta(e.target.value)}
                  className="rounded-md border border-[#E2E8F0] px-2 py-1 text-[11px]"
                />
                <button
                  type="button"
                  onClick={() => void refresh()}
                  className="rounded-full bg-[#2563EB] px-2.5 py-1 text-[10px] font-semibold text-white"
                >
                  Aplicar
                </button>
              </>
            )}
            <p className="ml-auto text-[11px] text-[#64748B]">
              {metricas.rango.etiqueta}
              {loading ? " · actualizando…" : ""}
            </p>
          </div>
        </motion.div>

        {/* Snapshot: ingresos por ventas (Hoy / Semana / Mes) */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {(
            [
              {
                periodo: "Hoy",
                titulo: "Ventas de hoy",
                monto: r.montoHoy,
                ventas: r.ventasHoy,
                accent: "border-l-[#E11D48]",
                labelColor: "text-[#E11D48]",
                iconWrap: "bg-[#FFF1F2] text-[#E11D48]",
              },
              {
                periodo: "Semana",
                titulo: "Ventas de la semana",
                monto: r.montoSemana,
                ventas: r.ventasSemana,
                accent: "border-l-[#7C3AED]",
                labelColor: "text-[#7C3AED]",
                iconWrap: "bg-[#F5F3FF] text-[#7C3AED]",
              },
              {
                periodo: "Mes",
                titulo: "Ventas del mes",
                monto: r.montoMes,
                ventas: r.ventasMes,
                accent: "border-l-[#0D9488]",
                labelColor: "text-[#0D9488]",
                iconWrap: "bg-[#F0FDFA] text-[#0D9488]",
              },
            ] as const
          ).map((item, i) => {
            const ticketProm =
              item.ventas > 0 ? Math.round(item.monto / item.ventas) : 0;
            return (
              <motion.div
                key={item.periodo}
                className={`rounded-lg border border-[#E8E4E8] border-l-4 bg-white px-3 py-2.5 ${item.accent}`}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
              >
                <div className="mb-1.5 flex items-center gap-2">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${item.iconWrap}`}
                  >
                    <ShoppingBag size={14} />
                  </span>
                  <div className="min-w-0">
                    <p
                      className={`font-[Inter,system-ui,sans-serif] text-[12px] font-medium leading-none ${item.labelColor}`}
                    >
                      {item.titulo}
                    </p>
                    <p className="mt-0.5 font-[Inter,system-ui,sans-serif] text-[10px] text-[#94A3B8]">
                      Ingresos por ventas
                    </p>
                  </div>
                </div>
                <p className="text-[22px] font-bold leading-none tracking-tight text-[#0F172A]">
                  <AnimatedNumber value={item.monto} format={formatMoney} />
                </p>
                <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[12px] text-[#475569]">
                  <span>
                    <span className="font-semibold text-[#0F172A]">
                      <AnimatedNumber value={item.ventas} duration={0.9} />
                    </span>{" "}
                    {item.ventas === 1 ? "venta" : "ventas"}
                  </span>
                  <span className="text-[#CBD5E1]">·</span>
                  <span>
                    Ticket prom.{" "}
                    <span className="font-semibold text-[#0F172A]">
                      {item.ventas > 0 ? (
                        <AnimatedNumber value={ticketProm} format={formatMoney} />
                      ) : (
                        "—"
                      )}
                    </span>
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* KPIs mini */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-8">
          <MiniKpi
            index={0}
            tone="blue"
            label="Stock"
            value={<AnimatedNumber value={metricas.inventario.stockTotal} />}
            hint={`${metricas.inventario.productosActivos} SKU`}
            icon={<Package size={12} />}
          />
          <MiniKpi
            index={1}
            tone="violet"
            label="Botines"
            value={<AnimatedNumber value={botines?.stockTotal ?? 0} />}
            hint={<AnimatedNumber value={botines?.ventasMonto ?? 0} format={formatMoney} />}
            icon={<LniIcon name={Lni.botines} size={14} />}
          />
          <MiniKpi
            index={2}
            tone="teal"
            label="Sandalias"
            value={<AnimatedNumber value={sandalias?.stockTotal ?? 0} />}
            hint={<AnimatedNumber value={sandalias?.ventasMonto ?? 0} format={formatMoney} />}
            icon={<LniIcon name={Lni.sandalias} size={14} />}
          />
          <MiniKpi
            index={3}
            tone="orange"
            label="Capital"
            value={
              <AnimatedNumber
                value={f.capitalEnStock}
                format={formatMoney}
              />
            }
            hint="Aún en stock"
            icon={<Wallet size={12} />}
          />
          <MiniKpi
            index={4}
            tone="amber"
            label="Compras"
            value={
              <AnimatedNumber value={f.comprasPeriodo} format={formatMoney} />
            }
            hint="Al proveedor"
            icon={<Wallet size={12} />}
          />
          <MiniKpi
            index={5}
            tone="emerald"
            label="Ventas"
            value={
              <AnimatedNumber value={f.ventasPeriodo} format={formatMoney} />
            }
            hint={`${metricas.ventas.cantidadVentas} ventas`}
            icon={<TrendingUp size={12} />}
          />
          <MiniKpi
            index={6}
            tone={f.gananciaPeriodo >= 0 ? "emerald" : "rose"}
            label="Ganancia"
            value={
              <AnimatedNumber value={f.gananciaPeriodo} format={formatMoney} />
            }
            hint={
              <>
                <AnimatedNumber value={f.gananciaPorPar} format={formatMoney} />
                {" /par"}
              </>
            }
            icon={
              f.gananciaPeriodo >= 0 ? (
                <TrendingUp size={12} />
              ) : (
                <TrendingDown size={12} />
              )
            }
          />
          <MiniKpi
            index={7}
            tone="teal"
            label="Pares por precio"
            value={
              <span className="flex items-baseline gap-1.5">
                <span className="text-[15px] font-bold text-[#0F172A]">
                  <AnimatedNumber value={metricas.ventas.paresPrecioLista ?? 0} />
                </span>
                <span className="text-[10px] font-medium text-[#64748B]">a S/75</span>
              </span>
            }
            hint={
              <>
                <AnimatedNumber value={metricas.ventas.paresPrecioRebaja ?? 0} />
                {" a S/59"}
              </>
            }
            icon={<ShoppingBag size={12} />}
          />
        </div>

        {/* Detalle capital / inversión / ganancia */}
        <motion.div
          className="rounded-xl border border-[#E8E4E8] bg-white p-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          <div className="mb-2 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h3 className="font-[Inter,system-ui,sans-serif] text-[12px] font-semibold text-[#0F172A]">
                Capital, inversión y ganancia
              </h3>
              <p className="text-[11px] text-[#64748B]">
                Rango: {metricas.rango.etiqueta}. Ejemplo: compras a S/47 y vendes
                a S/75 → ganas S/28 por par.
              </p>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-lg bg-[#FFF7ED] px-3 py-2">
              <p className="text-[10px] font-semibold uppercase text-[#C2410C]">
                Compras al proveedor
              </p>
              <p className="text-[18px] font-bold text-[#0F172A]">
                <AnimatedNumber value={f.comprasPeriodo} format={formatMoney} />
              </p>
              <p className="text-[10px] text-[#9A3412]">
                Precio compra × pares del lote (ej. 47×6=282)
              </p>
            </div>
            <div className="rounded-lg bg-[#FFFBEB] px-3 py-2">
              <p className="text-[10px] font-semibold uppercase text-[#B45309]">
                Capital en stock
              </p>
              <p className="text-[18px] font-bold text-[#0F172A]">
                <AnimatedNumber value={f.capitalEnStock} format={formatMoney} />
              </p>
              <p className="text-[10px] text-[#92400E]">
                Lo que aún tienes invertido en el almacén
              </p>
            </div>
            <div className="rounded-lg bg-[#EFF6FF] px-3 py-2">
              <p className="text-[10px] font-semibold uppercase text-[#1D4ED8]">
                Ventas (ingresos)
              </p>
              <p className="text-[18px] font-bold text-[#0F172A]">
                <AnimatedNumber value={f.ventasPeriodo} format={formatMoney} />
              </p>
              <p className="text-[10px] text-[#1E40AF]">
                {metricas.ventas.paresVendidos} pares · precio venta
              </p>
            </div>
            <div className="rounded-lg bg-[#F8FAFC] px-3 py-2">
              <p className="text-[10px] font-semibold uppercase text-[#475569]">
                Costo de lo vendido
              </p>
              <p className="text-[18px] font-bold text-[#0F172A]">
                <AnimatedNumber
                  value={f.costoVentasPeriodo}
                  format={formatMoney}
                />
              </p>
              <p className="text-[10px] text-[#64748B]">
                Precio compra × pares vendidos
              </p>
            </div>
            <div className="rounded-lg bg-[#ECFDF5] px-3 py-2">
              <p className="text-[10px] font-semibold uppercase text-[#047857]">
                Tu ganancia
              </p>
              <p className="text-[18px] font-bold text-[#0F172A]">
                <AnimatedNumber value={f.gananciaPeriodo} format={formatMoney} />
              </p>
              <p className="text-[10px] text-[#065F46]">
                Ventas − costo ·{" "}
                <AnimatedNumber value={f.gananciaPorPar} format={formatMoney} />
                /par
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <DashboardCharts
            serieDiaria={metricas.serieDiaria}
            porTipo={metricas.porTipo}
            topVendidos={metricas.topVendidos}
            alertasStock={metricas.alertasStock}
            inventario={metricas.inventario}
            financiero={metricas.financiero}
          />
        </motion.div>
      </motion.div>
    </InventoryManagementLayout>
  );
}
