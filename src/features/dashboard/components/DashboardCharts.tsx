import type { ReactNode } from "react";
import { motion } from "motion/react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  DashboardAlertaStock,
  DashboardDiaSerie,
  DashboardMetricas,
  DashboardTopVendido,
  DashboardTipoResumen,
} from "../models/dashboard.model";
import { AnimatedNumber } from "./AnimatedNumber";

const BOT = "#7C3AED"; // violet — botines
const SAN = "#0D9488"; // teal — sandalias
const ROSE = "#E11D48";
const AMBER = "#D97706";
const EMERALD = "#059669";
const GRID = "#E2E8F0";
const AXIS = "#94A3B8";

type DashboardChartsProps = {
  serieDiaria: DashboardDiaSerie[];
  porTipo: DashboardTipoResumen[];
  topVendidos: DashboardTopVendido[];
  alertasStock: DashboardAlertaStock[];
  inventario: DashboardMetricas["inventario"];
  financiero: DashboardMetricas["financiero"];
};

function formatDayLabel(fecha: string) {
  if (!fecha) return "";
  const parts = fecha.split("-");
  if (parts.length < 3) return fecha;
  return `${parts[2]}/${parts[1]}`;
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

function ChartCard({
  title,
  legend,
  children,
  index = 0,
}: {
  title: string;
  legend?: ReactNode;
  children: ReactNode;
  index?: number;
}) {
  return (
    <motion.div
      className="rounded-xl border border-[#E8E4E8] bg-white p-3"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.08 * index,
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="font-[Inter,system-ui,sans-serif] text-[11px] font-medium tracking-normal text-[#64748B]">
          {title}
        </h3>
        {legend}
      </div>
      {children}
    </motion.div>
  );
}

function TipoLegend() {
  return (
    <div className="flex gap-2 text-[9px] text-[#64748B]">
      <span className="inline-flex items-center gap-1">
        <i className="h-1.5 w-1.5 rounded-full" style={{ background: BOT }} /> Botines
      </span>
      <span className="inline-flex items-center gap-1">
        <i className="h-1.5 w-1.5 rounded-full" style={{ background: SAN }} /> Sandalias
      </span>
    </div>
  );
}

export function DashboardCharts({
  serieDiaria,
  porTipo,
  topVendidos,
  alertasStock,
  inventario,
  financiero,
}: DashboardChartsProps) {
  const serie = serieDiaria.map((d) => ({
    ...d,
    label: formatDayLabel(d.fecha),
    botinesMonto: d.botinesMonto ?? 0,
    sandaliasMonto: d.sandaliasMonto ?? 0,
    botinesPares: d.botinesPares ?? 0,
    sandaliasPares: d.sandaliasPares ?? 0,
  }));

  const stockPorTipo = [
    {
      name: "Botines",
      value: porTipo.find((t) => t.codigo === "BOTINES")?.stockTotal ?? 0,
      color: BOT,
    },
    {
      name: "Sandalias",
      value: porTipo.find((t) => t.codigo === "SANDALIAS")?.stockTotal ?? 0,
      color: SAN,
    },
  ];

  const ventasPorTipo = [
    {
      name: "Botines",
      value: porTipo.find((t) => t.codigo === "BOTINES")?.ventasMonto ?? 0,
      color: BOT,
    },
    {
      name: "Sandalias",
      value: porTipo.find((t) => t.codigo === "SANDALIAS")?.ventasMonto ?? 0,
      color: SAN,
    },
  ];

  const finanzas = [
    {
      name: "Botines",
      inversion: porTipo.find((t) => t.codigo === "BOTINES")?.inversion ?? 0,
      ganado: porTipo.find((t) => t.codigo === "BOTINES")?.ventasMonto ?? 0,
    },
    {
      name: "Sandalias",
      inversion: porTipo.find((t) => t.codigo === "SANDALIAS")?.inversion ?? 0,
      ganado: porTipo.find((t) => t.codigo === "SANDALIAS")?.ventasMonto ?? 0,
    },
  ];

  const saludStock = [
    {
      name: "OK",
      value: Math.max(
        0,
        inventario.productosActivos -
          inventario.stockBajo -
          inventario.stockAgotado,
      ),
      color: EMERALD,
    },
    { name: "Bajo", value: inventario.stockBajo, color: AMBER },
    { name: "Agotado", value: inventario.stockAgotado, color: ROSE },
  ].filter((x) => x.value > 0);

  const topChart = topVendidos.slice(0, 5).map((t) => ({
    name: t.sku.length > 12 ? `${t.sku.slice(0, 10)}…` : t.sku,
    pares: t.paresVendidos,
    fill: t.codigoTipo === "SANDALIAS" ? SAN : BOT,
  }));

  const emptySerie = serie.length === 0;
  const tipStyle = {
    borderRadius: 10,
    border: "1px solid #E2E8F0",
    fontSize: 11,
  };

  return (
    <div className="space-y-2.5">
      <div className="grid gap-2.5 lg:grid-cols-2">
        <ChartCard index={0} title="Monto diario · Botines vs Sandalias" legend={<TipoLegend />}>
          <div className="h-[180px] w-full">
            {emptySerie ? (
              <EmptyChart />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={serie} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gBot" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={BOT} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={BOT} stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="gSan" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={SAN} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={SAN} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fill: AXIS, fontSize: 10 }} tickLine={false} />
                  <YAxis tick={{ fill: AXIS, fontSize: 10 }} axisLine={false} tickLine={false} width={34} />
                  <Tooltip
                    contentStyle={tipStyle}
                    formatter={(value, name) => [
                      formatMoney(Number(value ?? 0)),
                      name === "botinesMonto" ? "Botines" : "Sandalias",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="botinesMonto"
                    stroke={BOT}
                    strokeWidth={2}
                    fill="url(#gBot)"
                    dot={{ r: 2.5, fill: BOT, strokeWidth: 0 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="sandaliasMonto"
                    stroke={SAN}
                    strokeWidth={2}
                    fill="url(#gSan)"
                    dot={{ r: 2.5, fill: SAN, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </ChartCard>

        <ChartCard index={1} title="Pares vendidos · Botines vs Sandalias" legend={<TipoLegend />}>
          <div className="h-[180px] w-full">
            {emptySerie ? (
              <EmptyChart />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={serie} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barGap={2}>
                  <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fill: AXIS, fontSize: 10 }} tickLine={false} />
                  <YAxis tick={{ fill: AXIS, fontSize: 10 }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip
                    contentStyle={tipStyle}
                    formatter={(value, name) => [
                      Number(value ?? 0),
                      name === "botinesPares" ? "Botines" : "Sandalias",
                    ]}
                  />
                  <Bar dataKey="botinesPares" fill={BOT} radius={[3, 3, 0, 0]} maxBarSize={18} />
                  <Bar dataKey="sandaliasPares" fill={SAN} radius={[3, 3, 0, 0]} maxBarSize={18} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
        <ChartCard index={2} title="Stock actual · pares en inventario" legend={<TipoLegend />}>
          <InfoDonut
            data={stockPorTipo}
            tipStyle={tipStyle}
            totalLabel="pares"
            formatValue={(n) => `${Math.round(n)} pares`}
          />
        </ChartCard>

        <ChartCard index={3} title="Ventas del periodo · ingresos (S/)" legend={<TipoLegend />}>
          <InfoDonut
            data={ventasPorTipo}
            tipStyle={tipStyle}
            totalLabel="total"
            formatValue={formatMoney}
            isMoney
          />
        </ChartCard>

        <ChartCard index={4} title="Capital en stock vs ventas">
          <div className="h-[150px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={finanzas} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fill: AXIS, fontSize: 10 }} tickLine={false} />
                <YAxis tick={{ fill: AXIS, fontSize: 9 }} axisLine={false} width={28} />
                <Tooltip contentStyle={tipStyle} formatter={(v) => formatMoney(Number(v ?? 0))} />
                <Bar dataKey="inversion" name="Capital stock" fill={AMBER} radius={[3, 3, 0, 0]} maxBarSize={20} />
                <Bar dataKey="ganado" name="Ventas" fill={EMERALD} radius={[3, 3, 0, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-1 grid grid-cols-2 gap-1 text-[10px]">
            <p className="rounded-md bg-[#FFFBEB] px-1.5 py-1 text-[#92400E]">
              Capital{" "}
              <span className="font-bold text-[#0F172A]">
                <AnimatedNumber
                  value={financiero.capitalEnStock ?? financiero.dineroInvertido}
                  format={formatMoney}
                />
              </span>
            </p>
            <p className="rounded-md bg-[#ECFDF5] px-1.5 py-1 text-[#065F46]">
              Ganancia{" "}
              <span className="font-bold text-[#0F172A]">
                <AnimatedNumber
                  value={
                    financiero.gananciaPeriodo ?? financiero.utilidadEstimada
                  }
                  format={formatMoney}
                />
              </span>
            </p>
          </div>
        </ChartCard>

        <ChartCard index={5} title="Salud del stock · productos">
          <InfoDonut
            data={saludStock}
            tipStyle={tipStyle}
            totalLabel="productos"
            formatValue={(n) => `${Math.round(n)}`}
          />
        </ChartCard>
      </div>

      <div className="grid gap-2.5 lg:grid-cols-2">
        <ChartCard index={6} title="Top vendidos (pares)" legend={<TipoLegend />}>
          <div className="h-[160px]">
            {topChart.length === 0 ? (
              <EmptyChart />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={topChart} margin={{ top: 0, right: 8, left: 4, bottom: 0 }}>
                  <XAxis type="number" tick={{ fill: AXIS, fontSize: 9 }} />
                  <YAxis type="category" dataKey="name" width={78} tick={{ fill: AXIS, fontSize: 9 }} />
                  <Tooltip contentStyle={tipStyle} />
                  <Bar dataKey="pares" radius={[0, 4, 4, 0]} maxBarSize={12}>
                    {topChart.map((e) => (
                      <Cell key={e.name} fill={e.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </ChartCard>

        <ChartCard index={7} title="Alertas de stock">
          <div className="h-[160px] overflow-y-auto pr-1">
            {alertasStock.length === 0 ? (
              <div className="flex h-full items-center justify-center text-[12px] font-medium text-[#059669]">
                Inventario saludable
              </div>
            ) : (
              <ul className="space-y-1">
                {alertasStock.slice(0, 8).map((a) => (
                  <li
                    key={a.idProducto}
                    className="flex items-center justify-between gap-2 rounded-lg bg-[#F8FAFC] px-2 py-1 text-[11px]"
                  >
                    <span className="min-w-0 truncate text-[#334155]">
                      <span
                        className="mr-1 inline-block h-1.5 w-1.5 rounded-full"
                        style={{
                          background: a.codigoTipo === "SANDALIAS" ? SAN : BOT,
                        }}
                      />
                      {a.sku}
                    </span>
                    <span
                      className={[
                        "shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold text-white",
                        a.nivel === "agotado"
                          ? "bg-[#E11D48]"
                          : a.nivel === "critico"
                            ? "bg-[#EA580C]"
                            : "bg-[#D97706]",
                      ].join(" ")}
                    >
                      {a.nivel} {a.stockActual}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

function InfoDonut({
  data,
  tipStyle,
  totalLabel,
  formatValue,
  isMoney,
}: {
  data: Array<{ name: string; value: number; color: string }>;
  tipStyle: Record<string, string | number>;
  totalLabel: string;
  formatValue: (n: number) => string;
  isMoney?: boolean;
}) {
  if (data.length === 0 || data.every((d) => d.value === 0)) {
    return (
      <div className="flex h-[160px] items-center justify-center text-[11px] text-[#94A3B8]">
        Sin datos
      </div>
    );
  }

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="flex items-center gap-2">
      <div className="relative h-[140px] w-[140px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={38}
              outerRadius={58}
              paddingAngle={2}
            >
              {data.map((e) => (
                <Cell key={e.name} fill={e.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={tipStyle}
              formatter={(v, n) => [formatValue(Number(v ?? 0)), String(n)]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-[13px] font-bold leading-none text-[#0F172A]">
            {isMoney ? (
              <AnimatedNumber value={total} format={formatMoney} />
            ) : (
              <AnimatedNumber value={total} />
            )}
          </p>
          <p className="mt-0.5 text-[9px] font-medium uppercase tracking-wide text-[#94A3B8]">
            {totalLabel}
          </p>
        </div>
      </div>

      <ul className="min-w-0 flex-1 space-y-1.5">
        {data.map((d) => {
          const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
          return (
            <motion.li
              key={d.name}
              className="rounded-md bg-[#F8FAFC] px-2 py-1.5"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35 }}
            >
              <div className="flex items-center gap-1.5">
                <i
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: d.color }}
                />
                <span className="truncate text-[11px] font-semibold text-[#334155]">
                  {d.name}
                </span>
                <span className="ml-auto shrink-0 text-[10px] font-bold text-[#64748B]">
                  <AnimatedNumber value={pct} format={(n) => `${Math.round(n)}%`} duration={0.8} />
                </span>
              </div>
              <p className="mt-0.5 pl-3.5 text-[12px] font-bold leading-tight text-[#0F172A]">
                <AnimatedNumber value={d.value} format={formatValue} />
              </p>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="flex h-full items-center justify-center text-[11px] text-[#94A3B8]">
      Sin datos
    </div>
  );
}
