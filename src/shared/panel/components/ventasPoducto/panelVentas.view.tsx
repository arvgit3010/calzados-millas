import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Trash2, Brush } from "lucide-react";
import { CalzadoPanel } from "@/shared/panel";
import type { GetAllBotinesInventoryResponse } from "@/features/gestion-botines/models/botinesInventory.model";

type SaleItem = {
  id: number;
  name: string;
  code: string;
  color: string;
  size: number;
  price: number;
  qty: number;
};

const UNIT_PRICE = 75;

const INITIAL_STOCK: Record<number, number> = {
  35: 0,
  36: 2,
  37: 0,
};

const ventaFormSchema = z.object({
  customerName: z.string().min(1, "El nombre es obligatorio"),
  dni: z
    .string()
    .min(8, "Mínimo 8 dígitos")
    .max(8, "Máximo 8 dígitos")
    .regex(/^\d+$/, "Solo números"),
  phone: z
    .string()
    .min(9, "Mínimo 9 dígitos")
    .regex(/^\d+$/, "Solo números"),
  district: z.string().min(1, "El distrito es obligatorio"),
  province: z.string().min(1, "La provincia es obligatoria"),
  address: z.string().min(1, "La dirección es obligatoria"),
});

type VentaFormData = z.infer<typeof ventaFormSchema>;

type PanelVentasViewProps = {
  initialProduct: GetAllBotinesInventoryResponse | null;
};

export function PanelVentasView({ initialProduct }: PanelVentasViewProps) {
  const [items, setItems] = useState<SaleItem[]>([]);
  const [stockBySize, setStockBySize] = useState<Record<number, number>>(INITIAL_STOCK);
  const [selectedSize, setSelectedSize] = useState<number>(36);
  const [quantity, setQuantity] = useState<number>(1);
  const [currentProduct, setCurrentProduct] = useState<GetAllBotinesInventoryResponse | null>(
    initialProduct,
  );
  const [showSelector, setShowSelector] = useState(false);
  const [pendingProduct, setPendingProduct] = useState<GetAllBotinesInventoryResponse | null>(null);
  const [showConfirmProduct, setShowConfirmProduct] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VentaFormData>({
    resolver: zodResolver(ventaFormSchema),
    mode: "onBlur",
  });

  const unitPrice = currentProduct
    ? Number(currentProduct.precio_venta_par) || UNIT_PRICE
    : UNIT_PRICE;

  const handleAddItem = () => {
    setStockBySize((prevStock) => {
      const available = prevStock[selectedSize] ?? 0;
      if (available <= 0) return prevStock;

      const qtyToAdd = Math.min(quantity, available || quantity);

      setItems((prevItems) => [
        ...prevItems,
        {
          id: Date.now(),
          name: currentProduct?.nombreModelo ?? "DANA",
          code: currentProduct?.codigoModelo ?? "3020",
          color: currentProduct?.descripcionColor ?? "CAMEL",
          size: selectedSize,
          price: unitPrice,
          qty: qtyToAdd,
        },
      ]);

      return {
        ...prevStock,
        [selectedSize]: available - qtyToAdd,
      };
    });
  };

  const handleRemoveItem = (item: SaleItem) => {
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    setStockBySize((prev) => ({
      ...prev,
      [item.size]: (prev[item.size] ?? 0) + item.qty,
    }));
  };

  const handleClearList = () => {
    setItems([]);
    setStockBySize(INITIAL_STOCK);
  };

  const onSubmit = (data: VentaFormData) => {
    // Por ahora solo validamos y dejamos listo para conectar con backend
    console.log("Venta válida", data);
  };

  const totalPairs = items.reduce((sum, item) => sum + item.qty, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.qty * item.price, 0);

  const currentStock = stockBySize[selectedSize] ?? 0;

  const handleApplySelectedProduct = (product: GetAllBotinesInventoryResponse) => {
    setCurrentProduct(product);

    const talla = Number(product.descripcionTalla) || selectedSize;

    // Actualizamos talla seleccionada, cantidad y stock disponible para esa talla
    setSelectedSize(talla);
    setQuantity(1);
    setStockBySize({
      35: talla === 35 ? product.stock_actual : 0,
      36: talla === 36 ? product.stock_actual : 0,
      37: talla === 37 ? product.stock_actual : 0,
    });

    setShowSelector(false);
  };

  const handleSelectFromInventory = (product: GetAllBotinesInventoryResponse) => {
    setPendingProduct(product);
    setShowConfirmProduct(true);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]"
    >
      {/* Columna izquierda: formulario y selección */}
      <div className="space-y-3">
        {/* Información del cliente */}
        <section className="rounded-lg border border-[#F0E3E6] bg-white p-3">
          <header className="mb-2 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFF3F7] text-[#984258]">
              <span className="text-sm">😊</span>
            </div>
            <h2 className="text-[13px] font-semibold text-[#251721]">
              Información del Cliente
            </h2>
          </header>

          <div className="grid gap-1.5 md:grid-cols-3">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#A28C8F]">
                Nombre del Cliente
              </label>
              <input
                type="text"
                placeholder="Julián"
                className="mt-1 h-8 w-full rounded-lg border border-[#F0E3E6] bg-[#FFF9FB] px-2 text-[13px] text-[#251721] placeholder:text-[#C8B3B7] focus:outline-none focus:ring-1 focus:ring-[#E39CA8]"
                {...register("customerName")}
              />
              {errors.customerName && (
                <p className="mt-1 text-[11px] text-red-600">
                  {errors.customerName.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#A28C8F]">
                DNI
              </label>
              <input
                type="text"
                placeholder="71234567"
                className="mt-1 h-8 w-full rounded-lg border border-[#F0E3E6] bg-[#FFF9FB] px-2 text-[13px] text-[#251721] placeholder:text-[#C8B3B7] focus:outline-none focus:ring-1 focus:ring-[#E39CA8]"
                {...register("dni")}
              />
              {errors.dni && (
                <p className="mt-1 text-[11px] text-red-600">{errors.dni.message}</p>
              )}
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#A28C8F]">
                Teléfono
              </label>
              <input
                type="tel"
                placeholder="987654321"
                className="mt-1 h-8 w-full rounded-lg border border-[#F0E3E6] bg-[#FFF9FB] px-2 text-[13px] text-[#251721] placeholder:text-[#C8B3B7] focus:outline-none focus:ring-1 focus:ring-[#E39CA8]"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="mt-1 text-[11px] text-red-600">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Ubicación de entrega */}
        <section className="rounded-lg border border-[#F0E3E6] bg-white p-3">
          <header className="mb-2 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFF3F7] text-[#984258]">
              <span className="text-sm">📍</span>
            </div>
            <h2 className="text-[13px] font-semibold text-[#251721]">
              Ubicación de Entrega
            </h2>
          </header>

          <div className="grid gap-1.5 md:grid-cols-3">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#A28C8F]">
                Distrito
              </label>
              <input
                type="text"
                placeholder="Miraflores"
                className="mt-1 h-8 w-full rounded-lg border border-[#F0E3E6] bg-[#FFF9FB] px-2 text-[13px] text-[#251721] placeholder:text-[#C8B3B7] focus:outline-none focus:ring-1 focus:ring-[#E39CA8]"
                {...register("district")}
              />
              {errors.district && (
                <p className="mt-1 text-[11px] text-red-600">
                  {errors.district.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#A28C8F]">
                Provincia
              </label>
              <input
                type="text"
                placeholder="Lima"
                className="mt-1 h-8 w-full rounded-lg border border-[#F0E3E6] bg-[#FFF9FB] px-2 text-[13px] text-[#251721] placeholder:text-[#C8B3B7] focus:outline-none focus:ring-1 focus:ring-[#E39CA8]"
                {...register("province")}
              />
              {errors.province && (
                <p className="mt-1 text-[11px] text-red-600">
                  {errors.province.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#A28C8F]">
                Dirección
              </label>
              <input
                type="text"
                placeholder="Av. Pardo 123, Of 402"
                className="mt-1 h-8 w-full rounded-lg border border-[#F0E3E6] bg-[#FFF9FB] px-2 text-[13px] text-[#251721] placeholder:text-[#C8B3B7] focus:outline-none focus:ring-1 focus:ring-[#E39CA8]"
                {...register("address")}
              />
              {errors.address && (
                <p className="mt-1 text-[11px] text-red-600">
                  {errors.address.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Agregar pedido */}
        <section className="rounded-lg border border-[#F0E3E6] bg-white p-3">
          <header className="mb-2 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFF3F7] text-[#984258]">
              <span className="text-sm">🧾</span>
            </div>
            <h2 className="text-[13px] font-semibold text-[#251721]">Agregar Pedido</h2>
          </header>

          <div className="space-y-3">
            {/* Card de producto seleccionada */}
            <div className="rounded-xl border border-[#F0E3E6] bg-[#FFF7F9] px-3 py-2.5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D9A46C]" />
                  <div>
                    <p className="text-[13px] font-semibold tracking-tight text-[#251721]">
                      {currentProduct?.nombreModelo ?? "DANA"}
                    </p>
                    <p className="text-[11px] text-[#867275]">3020 · CAMEL</p>
                  </div>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-[11px] font-medium text-[#984258] shadow-[0_0_0_1px_rgba(232,131,154,0.18)]">
                  {currentProduct ? `${currentProduct.stock_actual}p` : "4p"}
                </span>
              </div>
            </div>

            {/* Stock disponible por talla */}
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#A28C8F]">
                Stock disponible por talla
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[35, 36, 37].map((size) => {
                  const stock = stockBySize[size] ?? 0;
                  const isSelected = selectedSize === size;
                  const isDisabled = stock <= 0;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={[
                        "flex flex-col items-center justify-center rounded-xl border px-2 py-2 text-[11px] transition-colors",
                        isSelected
                          ? "border-[#984258] bg-[#984258] text-white"
                          : "border-[#F0E3E6] bg-[#FFFBFD] text-[#251721]",
                        isDisabled && !isSelected ? "opacity-60" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <span className="mb-1 text-[11px] font-medium">
                        T.{size}
                      </span>
                      <span className="text-[15px] font-semibold">
                        {stock}
                      </span>
                      <span className="mt-1 text-[10px] text-current/70">
                        {stock === 0 ? "+1 en lista" : "disponible"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Resumen de talla y precio */}
            <div className="flex items-center justify-between rounded-xl border border-[#F0E3E6] bg-[#FFFBFD] px-3 py-2 text-[12px]">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[12px] text-[#A28C8F]">
                  🏷
                </div>
                <div className="text-[#6B555A]">
                  <p className="text-[11px] font-medium">
                    {(currentProduct?.codigoModelo ?? "3020-CAM")}-{selectedSize}
                  </p>
                  <p className="text-[11px] text-[#A28C8F]">
                    Talla {selectedSize}
                  </p>
                </div>
              </div>
              <p className="text-[13px] font-semibold text-[#251721]">
                S/ {unitPrice.toFixed(2)}
              </p>
            </div>

            {/* Cantidad a vender */}
            <div className="rounded-xl border border-[#F0E3E6] bg-[#FFF9FB] px-3 py-2.5 text-[12px] text-[#251721]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#A28C8F]">
                Cantidad a vender — Talla {selectedSize}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3 md:justify-between">
                <div className="flex items-center gap-2 rounded-full bg-white px-2 py-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-[#E0D0D4] text-[14px] text-[#251721]"
                  >
                    −
                  </button>
                  <span className="min-w-[20px] text-center text-[13px] font-semibold">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((q) =>
                        currentStock > 0 ? Math.min(currentStock, q + 1) : q,
                      )
                    }
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-[#E0D0D4] text-[14px] text-[#251721]"
                  >
                    +
                  </button>
                  <span className="ml-1 text-[11px] text-[#A28C8F]">
                    de {Math.max(currentStock, quantity)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAddItem}
                    disabled={currentStock <= 0}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#984258] px-4 py-2 text-[12px] font-semibold text-white shadow-sm shadow-[#E8839A]/40 transition-colors hover:bg-[#7d3444] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span className="text-[14px]">+</span>
                    <span>Agregar a la lista</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSelector(true)}
                    className="text-[11px] font-medium text-[#984258] underline-offset-2 hover:underline"
                  >
                    Agregar más productos
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Columna derecha: lista de venta */}
      <aside className="flex min-h-[200px] flex-col rounded-lg border border-[#F0E3E6] bg-white p-3 text-sm">
        <div className="mb-1.5 flex items-center justify-between">
          <h2 className="text-[13px] font-semibold text-[#251721]">Lista de Venta</h2>
          {items.length > 0 && (
            <button
              type="button"
              onClick={handleClearList}
              className="flex items-center gap-1 text-[11px] font-medium text-[#B3949A] hover:text-[#984258]"
            >
              <Brush size={13} />
              <span>Limpiar</span>
            </button>
          )}
        </div>

        {items.length === 0 ? (
            <div className="mt-1.5 flex flex-1 flex-col items-center justify-center rounded-lg bg-[#FFF8FB] text-[#C1A7AC]">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF3F7]">
              <span className="text-xl">🛒</span>
            </div>
            <p className="text-[12px] font-medium text-[#B3949A]">
              La lista está vacía
            </p>
            <p className="text-[11px] text-[#C1A7AC]">
              Agrega productos desde la izquierda.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-1 flex-1 space-y-2 overflow-y-auto pr-1">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#F3E3E7] bg-[#FFFBFD] px-3 py-2 text-[12px]"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-6 w-6 rounded-full border border-[#E0D0D4] bg-[#F5E5D5]" />
                    <div>
                      <p className="text-[13px] font-semibold text-[#251721]">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-[#A28C8F]">
                        {item.color} · T.{item.size}
                      </p>
                      <p className="text-[11px] text-[#A28C8F]">
                        {item.qty}x S/ {item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <p className="text-[13px] font-semibold text-[#251721]">
                      S/ {(item.qty * item.price).toFixed(2)}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item)}
                      className="flex h-6 w-6 items-center justify-center rounded-full border border-[#E0D0D4] text-[#B3949A] hover:border-[#984258] hover:text-[#984258]"
                      aria-label="Quitar de la lista"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 space-y-2 border-t border-[#F0E3E6] pt-3 text-[12px]">
              <div className="flex items-center justify-between text-[#6B555A]">
                <span>Total items</span>
                <span>
                  {totalPairs} par{totalPairs !== 1 ? "es" : ""}
                </span>
              </div>
              <div className="flex items-baseline justify-between text-[#251721]">
                <span className="text-[12px] font-semibold">Total a pagar</span>
                <span className="text-[18px] font-bold tracking-tight text-[#984258]">
                  S/ {totalAmount.toFixed(2)}
                </span>
              </div>

              <button
                type="submit"
                className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#984258] text-[13px] font-semibold text-white shadow-sm shadow-[#E8839A]/40 transition-colors hover:bg-[#7d3444]"
              >
                <span>✔</span>
                <span>Confirmar Venta Total</span>
              </button>

              <p className="mt-1 text-center text-[10px] text-[#A28C8F]">
                Se generará comprobante automático.
              </p>
            </div>
          </>
        )}
      </aside>

      {/* Botón oculto de submit (para poder disparar validación general si lo necesitas luego) */}
      <button type="submit" className="hidden">
        Guardar venta
      </button>

      {/* Selector de productos (grilla principal) */}
      {showSelector && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 p-4 overflow-y-auto">
          <div className="relative flex h-[90vh] w-full max-w-5xl flex-col rounded-2xl bg-white p-3">
            <div className="mb-2 flex items-center justify-between px-1">
              <h2 className="text-[14px] font-semibold text-[#251721]">
                Seleccionar producto del inventario
              </h2>
              <button
                type="button"
                onClick={() => setShowSelector(false)}
                className="text-[12px] text-[#867275] hover:text-[#251721]"
              >
                Cerrar
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
              <CalzadoPanel
                rows={[]}
                inventoryTitle="Inventario general"
                onVenderProduct={handleSelectFromInventory}
              />
            </div>
          </div>
        </div>
      )}

      {/* Confirmación al agregar producto desde la grilla */}
      {showConfirmProduct && pendingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-4 shadow-lg">
            <h3 className="mb-2 text-[15px] font-semibold text-[#251721]">
              ¿Agregar producto a la venta?
            </h3>
            <p className="mb-3 text-[13px] text-[#544245]">
              {pendingProduct.nombreModelo} · {pendingProduct.descripcionColor} · T.
              {pendingProduct.descripcionTalla} — S/{" "}
              {Number(pendingProduct.precio_venta_par).toFixed(2)}
            </p>
            <div className="flex justify-end gap-2 text-[13px]">
              <button
                type="button"
                className="rounded-full border border-[#E5E7EB] px-4 py-1.5 text-[#544245] hover:bg-[#F9F4F6]"
                onClick={() => {
                  setShowConfirmProduct(false);
                  setPendingProduct(null);
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="rounded-full bg-[#984258] px-4 py-1.5 font-semibold text-white hover:bg-[#7d3444]"
                onClick={() => {
                  handleApplySelectedProduct(pendingProduct);
                  setShowConfirmProduct(false);
                  setPendingProduct(null);
                }}
              >
                Sí, agregar
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
