import {
  // AlertCircle,
  // AlertTriangle,
  ImageOff,
  // Package,
  Search,
  ShoppingCart,
  // Wallet,
} from "lucide-react";
import type { CalzadoPanelViewProps } from "../../hooks/useCalzadoPanel";
import {
  getStockStatus,
  STOCK_STATUS_CONFIG,
} from "../../utils/stockStatus";
import { AddProductModal } from "../AddProductModal/AddProductModal";

const GRID_HEADERS = [
  { label: "Imagen", align: "center" },
  { label: "ID Modelo", align: "left" },
  { label: "SKU", align: "left" },
  { label: "Modelo", align: "center" },
  { label: "Color", align: "center" },
  { label: "Talla", align: "center" },
  { label: "Stock", align: "center" },
  { label: "Observaciones", align: "left" },
  { label: "P. venta", align: "right" },
  { label: "Acciones", align: "right" },
] as const;

const headerAlignClass = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

export function CalzadoPanelView({
  displayTitle,
  canMutate,
  products,
  paginatedProducts,
  page,
  totalPages,
  nextPage,
  prevPage,
  loading,
  searchTerm,
  selectedRow,
  isSelectorMode,
  modalMode,
  setSelectedRow,
  setModalMode,
  handleAddSubmit,
  handleProductCreated,
  handleVender,
  handleSearchChange,
}: CalzadoPanelViewProps) {
  const venderLabel = isSelectorMode ? "Agregar a la venta" : "Vender";

  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
        <div className="shrink-0 border-b border-[#E5E7EB] p-2.5 md:p-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="min-w-0 break-words text-base font-bold text-[#251721] md:text-lg">
              {displayTitle}
            </h2>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <div className="relative w-full sm:w-64">
                <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-[#867275]">
                  <Search size={14} />
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => handleSearchChange(event.target.value)}
                  placeholder="Buscar por modelo, color, SKU…"
                  className="w-full rounded-lg border border-[#E5E7EB] bg-white px-7 py-1.5 text-[12px] text-[#251721] outline-none focus:border-[#984258] focus:ring-1 focus:ring-[#984258]/30"
                />
              </div>
              <div
                className="flex items-center gap-3 rounded-full bg-[#FFF7F9] px-3 py-1 text-[10px] text-[#544245]"
                aria-label="Leyenda de colores de stock"
              >
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#16A34A]" /> Disponible
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#EAB308]" /> Bajo
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#EF4444]" /> Crítico
                </span>
              </div>
              {canMutate && (
                <button
                  type="button"
                  onClick={() => setModalMode({ mode: "add" })}
                  className="border border-[#984258] rounded-lg bg-[#984258] text-white px-3 py-1.5 text-[13px] font-semibold cursor-pointer hover:bg-[#7A2E45] transition-all w-full shrink-0 sm:w-auto"
                >
                  + Agregar Producto
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-auto p-3 md:p-4 md:pt-3">
          <p className="mb-2 text-center text-[11px] text-[#867275] md:hidden">
            Desliza horizontalmente para ver toda la tabla
          </p>
          <div className="overflow-x-auto overscroll-x-contain">
            <table
              className={`w-full border-collapse ${
                isSelectorMode ? "" : "min-w-[1080px]"
              }`}
            >
              <thead className="bg-[#FFF0F6]">
                <tr>
                  {(isSelectorMode
                    ? GRID_HEADERS.filter((h) => h.label !== "Observaciones")
                    : GRID_HEADERS
                  ).map((header) => (
                    <th
                      key={header.label}
                      className={`px-4 py-3 text-[13px] font-semibold text-[#867275] uppercase tracking-[0.02em] whitespace-nowrap ${headerAlignClass[header.align]}`}
                    >
                      {header.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {loading ? (
                  <tr>
                    <td
                      colSpan={
                        isSelectorMode
                          ? GRID_HEADERS.length - 1
                          : GRID_HEADERS.length
                      }
                      className="px-4 py-8 text-center text-[13px] text-[#867275]"
                    >
                      Cargando productos…
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td
                      colSpan={
                        isSelectorMode
                          ? GRID_HEADERS.length - 1
                          : GRID_HEADERS.length
                      }
                      className="px-4 py-8 text-center text-[13px] text-[#867275]"
                    >
                      No hay productos para mostrar
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map((row) => (
                    <tr
                      key={row.id_producto}
                      className="group hover:bg-[#FBF0F0]/50 transition-all duration-150 hover:translate-x-[4px]"
                      style={{ transition: "all 0.15s ease" }}
                    >
                      <td className="px-4 py-3 text-center">
                        {row.imagen ? (
                          <img
                            src={row.imagen}
                            alt={`${row.nombreModelo} ${row.descripcionColor}`}
                            className="mx-auto w-11 h-11 rounded-lg border border-[#E5E7EB] object-cover bg-white"
                          />
                        ) : (
                          <div
                            className="mx-auto flex w-11 h-11 items-center justify-center rounded-lg border border-[#E5E7EB] bg-[#FFF0F6] text-[#867275]"
                            title="Sin imagen"
                          >
                            <ImageOff size={16} aria-hidden="true" />
                          </div>
                        )}
                      </td>
                      <td
                        className="px-4 py-3 text-sm font-bold text-[#251721] cursor-zoom-in"
                        onClick={() => setSelectedRow(row)}
                      >
                        {row.codigoModelo}
                      </td>
                      <td className="px-4 py-3 text-[13px] font-medium text-[#544245]">{row.sku}</td>
                      <td className="px-4 py-3 text-center text-sm font-semibold text-[#251721]">
                        {row.nombreModelo}
                      </td>
                      <td className="px-4 py-3 text-center text-[13px] text-[#544245]">
                        {row.descripcionColor}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div
                          className={`inline-flex min-w-[64px] flex-col items-center justify-center rounded-lg px-2 py-1 text-[11px] font-semibold ${
                            STOCK_STATUS_CONFIG[getStockStatus(row.stock_actual)].badgeClass
                          }`}
                          title={STOCK_STATUS_CONFIG[getStockStatus(row.stock_actual)].label}
                        >
                          <span className="leading-tight">T.{row.descripcionTalla}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-lg font-extrabold text-[#984258]">
                        {row.stock_actual}
                      </td>
                      {!isSelectorMode && (
                        <td className="px-4 py-3 text-[13px] text-[#544245] max-w-[220px]">
                          <span className="line-clamp-2">
                            {row.pro_observacion || "—"}
                          </span>
                        </td>
                      )}
                      <td className="px-4 py-3 text-right text-[13px] font-semibold text-[#251721]">
                        S/ {Number(row.precio_venta_par).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleVender(row)}
                          className="inline-flex items-center gap-1 rounded-full bg-[#984258] px-3 py-1 text-[11px] font-semibold text-white hover:bg-[#7A2E45]"
                          aria-label={venderLabel}
                        >
                          <ShoppingCart size={13} />
                          {isSelectorMode ? "Agregar a la venta" : venderLabel}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="mt-2 flex items-center justify-between px-1 text-[11px] text-[#544245]">
              <span>
                Mostrando {paginatedProducts.length} de {products.length} productos
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prevPage}
                  disabled={page <= 1}
                  className="rounded-full border border-[#E5E7EB] px-2 py-0.5 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F9F4F6]"
                >
                  Anterior
                </button>
                <span>
                  {page} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={nextPage}
                  disabled={page >= totalPages}
                  className="rounded-full border border-[#E5E7EB] px-2 py-0.5 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F9F4F6]"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Resumen inferior: pares / valor / stock bajo / crítico
        <div className="shrink-0 border-t border-[#E5E7EB] bg-[#FFF7F9] px-3 py-2">
          <div className="grid grid-cols-2 gap-1.5 lg:grid-cols-4 lg:gap-2">
            <div className="flex items-center gap-2 rounded-md bg-white border border-[#E5E7EB] px-2 py-1">
              <Package size={13} className="shrink-0 text-[#984258]" aria-hidden="true" />
              <div className="min-w-0 leading-tight">
                <p className="text-[12px] font-extrabold text-[#251721]">{totalPairs}</p>
                <p className="text-[9px] text-[#867275]">Pares en stock</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-md bg-white border border-[#E5E7EB] px-2 py-1">
              <Wallet size={13} className="shrink-0 text-[#984258]" aria-hidden="true" />
              <div className="min-w-0 leading-tight">
                <p className="text-[12px] font-extrabold text-[#251721]">
                  S/ {inventoryValue.toFixed(2)}
                </p>
                <p className="text-[9px] text-[#867275]">Valor inventario</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-md bg-white border border-[#E5E7EB] px-2 py-1">
              <AlertTriangle size={13} className="shrink-0 text-[#EAB308]" aria-hidden="true" />
              <div className="min-w-0 leading-tight">
                <p className="text-[12px] font-extrabold text-[#251721]">{lowStock}</p>
                <p className="text-[9px] text-[#867275]">Stock bajo</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-md bg-white border border-[#E5E7EB] px-2 py-1">
              <AlertCircle size={13} className="shrink-0 text-[#EF4444]" aria-hidden="true" />
              <div className="min-w-0 leading-tight">
                <p
                  className={`text-[12px] font-extrabold ${
                    needsBuy > 0 ? "text-[#EF4444]" : "text-[#251721]"
                  }`}
                >
                  {needsBuy}
                </p>
                <p className="text-[9px] text-[#867275]">Stock crítico</p>
              </div>
            </div>
          </div>
        </div>
        */}
      </div>

      {selectedRow ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setSelectedRow(null)}>
          <article
            className="product-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`Detalles de ${selectedRow.nombreModelo}`}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setSelectedRow(null)}
              aria-label="Cerrar modal"
            >
              x
            </button>
            {selectedRow.imagen ? (
              <img
                src={selectedRow.imagen}
                alt={selectedRow.nombreModelo}
                className="modal-photo"
              />
            ) : (
              <div className="modal-photo flex items-center justify-center bg-[#FFF0F6] text-[#867275]">
                <ImageOff size={32} />
              </div>
            )}
            <h3 className="modal-title">{selectedRow.nombreModelo}</h3>
            <p className="modal-subtitle">{selectedRow.descripcionColor}</p>
            <div className="modal-specs">
              <p>
                <strong>SKU:</strong> {selectedRow.sku}
              </p>
              <p>
                <strong>Código:</strong> {selectedRow.codigoModelo}
              </p>
              <p>
                <strong>Talla:</strong> {selectedRow.descripcionTalla}
              </p>
              <p>
                <strong>Stock:</strong> {selectedRow.stock_actual} pares
              </p>
              <p>
                <strong>P. venta:</strong> S/ {Number(selectedRow.precio_venta_par).toFixed(2)}
              </p>
              <p>
                <strong>Observaciones:</strong> {selectedRow.pro_observacion || "—"}
              </p>
            </div>
          </article>
        </div>
      ) : null}

      <AddProductModal
        open={modalMode !== null}
        onClose={() => setModalMode(null)}
        onSubmit={handleAddSubmit}
        onCreated={handleProductCreated}
        editingRow={modalMode?.mode === "edit" ? modalMode.row : undefined}
      />
    </section>
  );
}
