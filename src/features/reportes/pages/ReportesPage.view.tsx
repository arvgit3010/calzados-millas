import { Download, FileSpreadsheet, RefreshCw } from "lucide-react";
import { InventoryManagementLayout } from "@/shared/panel";
import type { ReporteCodigo, ReportePeriodo } from "../models/reportes.model";
import type { ReportesPageLogic } from "../hooks/useReportesPage";

function formatMoney(value: number) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

function formatCell(value: string | number | null | undefined) {
  if (value == null || value === "") return "—";
  if (typeof value === "number") {
    if (!Number.isInteger(value) && Math.abs(value) >= 0.01) {
      return formatMoney(value);
    }
    return String(value);
  }
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.slice(0, 16).replace("T", " ");
  }
  return String(value);
}

const PERIODOS: { id: ReportePeriodo; label: string }[] = [
  { id: "hoy", label: "Hoy" },
  { id: "ayer", label: "Ayer" },
  { id: "semana", label: "Semana" },
  { id: "mes", label: "Mes" },
  { id: "anio", label: "Año" },
  { id: "custom", label: "Rango" },
];

const COLUMN_LABELS: Record<string, string> = {
  idVenta: "ID",
  idLote: "Lote",
  idProducto: "ID",
  idMovimiento: "Mov.",
  fecha: "Fecha",
  tipo: "Tipo",
  cliente: "Cliente",
  dni: "DNI",
  pares: "Pares",
  monto: "Monto",
  precioPar: "P. compra",
  inversion: "Inversión",
  sku: "SKU",
  stock: "Stock",
  precioCompra: "Compra",
  precioVenta: "Venta",
  capital: "Capital",
  ventas: "Ventas",
  costo: "Costo",
  ganancia: "Ganancia",
  precioUnitario: "P. unit.",
  tramo: "Tramo",
  etiquetaPrecio: "Precio",
  proveedor: "Proveedor",
  modelo: "Modelo",
  color: "Color",
  talla: "Talla",
  stockActual: "Stock",
  nivel: "Nivel",
  stockObjetivo: "Objetivo",
  sugeridoComprar: "Comprar",
  costoEstimado: "Costo est.",
  codigoProveedor: "Cód. prov.",
};

function columnsFromRows(filas: Array<Record<string, string | number | null>>) {
  if (filas.length === 0) return [] as string[];
  return Object.keys(filas[0]).filter(
    (k) =>
      !["idTipoCalzado", "idProducto", "codigoProveedor", "stockObjetivo"].includes(
        k,
      ),
  );
}

export function ReportesPageView({
  title,
  periodo,
  setPeriodo,
  desde,
  setDesde,
  hasta,
  setHasta,
  idTipoCalzado,
  setIdTipoCalzado,
  codigo,
  setCodigo,
  catalogo,
  detalle,
  loading,
  exporting,
  load,
  exportarCsv,
  exportarExcel,
}: ReportesPageLogic) {
  const filas = detalle?.filas ?? [];
  const columns = columnsFromRows(filas);
  const t = catalogo.totales;
  const resumen = detalle?.resumen ?? {};
  const isReposicion = codigo === "reposicion";

  return (
    <InventoryManagementLayout
      title={title}
      rows={[]}
      contentScrollable
      compactTitle
    >
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <section className="rounded-lg border border-[#EDE6E8] bg-[#FFFBFC] p-3">
          <div className="flex flex-wrap items-end gap-2">
            {!isReposicion ? (
              <div>
                <label className="mb-1 block text-[10px] font-medium tracking-wide text-[#8A7A7E]">
                  Periodo
                </label>
                <div className="flex flex-wrap gap-1">
                  {PERIODOS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPeriodo(p.id)}
                      className={`h-7 rounded-full border px-2.5 text-[11px] font-medium transition-colors ${
                        periodo === p.id
                          ? "border-[#E2B8C2] bg-[#FFF0F5] text-[#984258]"
                          : "border-[#EDE6E8] bg-white text-[#6B5A5E] hover:bg-[#FFFBFC]"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {!isReposicion && periodo === "custom" ? (
              <>
                <div>
                  <label className="mb-1 block text-[10px] font-medium text-[#8A7A7E]">
                    Desde
                  </label>
                  <input
                    type="date"
                    value={desde}
                    onChange={(e) => setDesde(e.target.value)}
                    className="h-7 rounded-md border border-[#EDE6E8] bg-white px-2 text-[11px] text-[#3A3033] outline-none focus:border-[#E2B8C2]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-medium text-[#8A7A7E]">
                    Hasta
                  </label>
                  <input
                    type="date"
                    value={hasta}
                    onChange={(e) => setHasta(e.target.value)}
                    className="h-7 rounded-md border border-[#EDE6E8] bg-white px-2 text-[11px] text-[#3A3033] outline-none focus:border-[#E2B8C2]"
                  />
                </div>
              </>
            ) : null}

            <div>
              <label className="mb-1 block text-[10px] font-medium text-[#8A7A7E]">
                Tipo
              </label>
              <select
                value={idTipoCalzado}
                onChange={(e) =>
                  setIdTipoCalzado(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                className="h-7 rounded-md border border-[#EDE6E8] bg-white px-2 text-[11px] text-[#3A3033] outline-none focus:border-[#E2B8C2]"
              >
                <option value="">Todos</option>
                <option value={1}>Botines (Julio)</option>
                <option value={2}>Sandalias (Ever)</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => void load()}
              disabled={loading}
              className="btn-pastel btn-pastel--brand"
            >
              <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
              Actualizar
            </button>
            <button
              type="button"
              onClick={() => void exportarCsv()}
              disabled={exporting || loading}
              className="btn-pastel btn-pastel--cancel"
            >
              <Download size={12} />
              {exporting ? "…" : "CSV"}
            </button>
            {isReposicion ? (
              <button
                type="button"
                onClick={() => void exportarExcel()}
                disabled={exporting || loading}
                className="btn-pastel btn-pastel--save"
              >
                <FileSpreadsheet size={12} />
                {exporting ? "Exportando…" : "Excel compra"}
              </button>
            ) : null}
          </div>
          <p className="mt-2 text-[11px] text-[#8A7A7E]">
            {isReposicion
              ? "Lista para comprar: Botines → Julio · Sandalias → Ever · stock ≤ 3 · objetivo 6 pares"
              : catalogo.rango.etiqueta
                ? `Rango: ${catalogo.rango.etiqueta}`
                : "Selecciona filtros y un tipo de reporte"}
          </p>
        </section>

        {isReposicion ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            <MiniStat
              label="Falta total"
              value={String(resumen.paresFaltantesTotal ?? 0)}
              hint="pares a comprar"
            />
            <MiniStat
              label="Julio"
              value={String(resumen.paresFaltantesJulio ?? 0)}
              hint="botines"
            />
            <MiniStat
              label="Ever"
              value={String(resumen.paresFaltantesEver ?? 0)}
              hint="sandalias"
            />
            <MiniStat
              label="Ítems bajos"
              value={String(resumen.itemsBajos ?? 0)}
              hint="SKU"
            />
            <MiniStat
              label="Costo est."
              value={formatMoney(Number(resumen.costoEstimadoTotal ?? 0))}
              hint="compra sugerida"
            />
            <MiniStat
              label="Objetivo"
              value={String(resumen.stockObjetivo ?? 6)}
              hint="pares / SKU"
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            <MiniStat
              label="Ventas"
              value={formatMoney(t.ventasMonto)}
              hint={`${t.ventasPares} pares`}
            />
            <MiniStat
              label="Compras"
              value={formatMoney(t.comprasMonto)}
              hint={`${t.comprasPares} pares`}
            />
            <MiniStat label="Stock" value={String(t.stockPares)} hint="pares" />
            <MiniStat
              label="Capital"
              value={formatMoney(t.capitalEnStock)}
              hint="en almacén"
            />
            <MiniStat
              label="A S/75"
              value={String(t.paresPrecioLista)}
              hint="pares lista"
            />
            <MiniStat
              label="A S/59"
              value={String(t.paresPrecioRebaja)}
              hint="pares rebaja"
            />
          </div>
        )}

        <section className="rounded-lg border border-[#EDE6E8] bg-white p-3">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#984258]">
            Tipo de reporte
          </p>
          <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
            {(catalogo.reportes.length > 0
              ? catalogo.reportes
              : [
                  {
                    codigo: "reposicion" as ReporteCodigo,
                    nombre: "Compra / stock bajo",
                    descripcion: "Qué falta comprar a Julio / Ever",
                  },
                ]
            ).map((r) => {
              const active = codigo === r.codigo;
              return (
                <button
                  key={r.codigo}
                  type="button"
                  onClick={() => setCodigo(r.codigo)}
                  className={`flex items-start gap-2 rounded-md border px-2.5 py-2 text-left transition-colors ${
                    active
                      ? "border-[#E2B8C2] bg-[#FFF7F9]"
                      : "border-[#EDE6E8] bg-[#FFFBFC] hover:bg-white"
                  }`}
                >
                  <FileSpreadsheet
                    size={14}
                    className={active ? "text-[#984258]" : "text-[#C4A4AC]"}
                  />
                  <span>
                    <span className="block text-[12px] font-semibold text-[#3A3033]">
                      {r.nombre}
                    </span>
                    <span className="block text-[10px] text-[#8A7A7E]">
                      {r.descripcion}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="min-h-0 flex-1 overflow-hidden rounded-lg border border-[#EDE6E8] bg-white">
          <div className="flex items-center justify-between border-b border-[#F0E8EB] px-3 py-2">
            <p className="text-[12px] font-semibold text-[#3A3033]">
              {isReposicion ? "Qué te falta comprar" : `Detalle · ${codigo}`}
            </p>
            <p className="text-[10px] text-[#8A7A7E]">
              {loading ? "Cargando…" : `${filas.length} filas`}
            </p>
          </div>
          <div className="max-h-[48vh] overflow-auto">
            {filas.length === 0 ? (
              <p className="px-3 py-8 text-center text-[12px] text-[#8A7A7E]">
                {loading ? "Cargando datos…" : "No hay datos para este filtro"}
              </p>
            ) : (
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead className="sticky top-0 bg-[#FAF7F8]">
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col}
                        className="border-b border-[#EDE6E8] px-2.5 py-2 text-[10px] font-semibold uppercase tracking-wide text-[#8A7A7E]"
                      >
                        {COLUMN_LABELS[col] ?? col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filas.map((row, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-[#F5EFF1] hover:bg-[#FFFBFC]"
                    >
                      {columns.map((col) => (
                        <td
                          key={col}
                          className="px-2.5 py-1.5 text-[11px] text-[#3A3033]"
                        >
                          {formatCell(row[col])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </InventoryManagementLayout>
  );
}

function MiniStat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-lg border border-[#EDE6E8] bg-[#FFFBFC] px-2.5 py-2">
      <p className="text-[10px] font-medium text-[#8A7A7E]">{label}</p>
      <p className="truncate text-[14px] font-semibold text-[#3A3033]">{value}</p>
      <p className="text-[10px] text-[#A8989C]">{hint}</p>
    </div>
  );
}
