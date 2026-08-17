import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Brush, CheckCircle2, Package, Printer, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { getApiErrorMessage, useAuth } from "@/core";
import {
  crearVentaProducto,
  imprimirEtiquetaVenta,
} from "@/features/gestion-ventas/services/ventas.service";
import type { CrearVentaProductoRequest } from "@/features/gestion-ventas/models/ventaProducto.model";
import { CalzadoPanel } from "@/shared/panel";
import type {
  GetAllBotinesInventoryResponse,
  GroupedStockDetails,
} from "@/features/gestion-botines/models/botinesInventory.model";
import StockDetailCard from "./StockDetailCard";

type SaleItem = {
  id: number;
  idProducto: number;
  name: string;
  code: string;
  sku: string;
  color: string;
  size: string;
  /** Precio de lista (catálogo). */
  listPrice: number;
  /** Precio real de esta venta (editable / rebaja). */
  price: number;
  qty: number;
  observation: string;
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
  loadingStock: boolean;
  groupedStockDetails: GroupedStockDetails;
  selectedColorId: number | null;
  setSelectedColorId: (id: number) => void;
  selectedSize: string | null;
  setSelectedSize: (size: string | null) => void;
  loadProductStock: (product: GetAllBotinesInventoryResponse) => Promise<boolean>;
};

export function PanelVentasView({
  initialProduct,
  loadingStock,
  groupedStockDetails,
  selectedColorId,
  setSelectedColorId,
  selectedSize,
  setSelectedSize,
  loadProductStock,
}: PanelVentasViewProps) {
  const { user } = useAuth();
  const [items, setItems] = useState<SaleItem[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [currentProduct, setCurrentProduct] = useState<GetAllBotinesInventoryResponse | null>(
    initialProduct,
  );
  const [showSelector, setShowSelector] = useState(false);
  const [selectorSection, setSelectorSection] = useState<"botines" | "sandalias">(
    "botines",
  );
  const [pendingProduct, setPendingProduct] = useState<GetAllBotinesInventoryResponse | null>(null);
  const [showConfirmProduct, setShowConfirmProduct] = useState(false);
  const [lastSaleId, setLastSaleId] = useState<number | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  /** Precio editable al vender (permite rebajas). */
  const [salePrice, setSalePrice] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VentaFormData>({
    resolver: zodResolver(ventaFormSchema),
    mode: "onBlur",
  });

  const listPrice = Number(currentProduct?.precio_venta_par);
  const purchasePrice = Number(currentProduct?.precio_compra_par);
  const hasValidListPrice = Number.isFinite(listPrice) && listPrice > 0;
  const salePriceNum = Number(salePrice);
  const hasValidSalePrice = Number.isFinite(salePriceNum) && salePriceNum > 0;

  useEffect(() => {
    if (hasValidListPrice) {
      setSalePrice(String(listPrice));
    } else {
      setSalePrice("");
    }
  }, [currentProduct?.id_producto, hasValidListPrice, listPrice]);

  const selectedVariant =
    selectedColorId !== null && selectedSize !== null
      ? groupedStockDetails[selectedColorId]?.sizes[selectedSize]
      : undefined;
  const reservedStockBySku = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.sku] = (acc[item.sku] ?? 0) + item.qty;
    return acc;
  }, {});
  const quantityAlreadyAdded = selectedVariant
    ? reservedStockBySku[selectedVariant.sku] ?? 0
    : 0;
  const currentStock = Math.max(
    0,
    (selectedVariant?.stock_actual ?? 0) - quantityAlreadyAdded,
  );

  useEffect(() => {
    setQuantity(1);
  }, [selectedColorId, selectedSize]);

  const handleAddItem = () => {
    if (!selectedVariant || !hasValidSalePrice || currentStock <= 0) return;

    setLastSaleId(null);
    const qtyToAdd = Math.min(quantity, currentStock);
    const priceToUse = Math.round(salePriceNum * 100) / 100;
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.sku === selectedVariant.sku);
      if (existingItem) {
        return prevItems.map((item) =>
          item.sku === selectedVariant.sku
            ? { ...item, qty: item.qty + qtyToAdd, price: priceToUse }
            : item,
        );
      }

      return [
        ...prevItems,
        {
          id: Date.now(),
          idProducto: selectedVariant.idProducto,
          name: selectedVariant.nombreModelo,
          code: selectedVariant.codigoModelo,
          sku: selectedVariant.sku,
          color: selectedVariant.descripcionColor,
          size: selectedVariant.descripcionTalla,
          listPrice: hasValidListPrice ? listPrice : priceToUse,
          price: priceToUse,
          qty: qtyToAdd,
          observation: selectedVariant.observacion,
        },
      ];
    });
    setQuantity(1);
    toast.success(
      `${selectedVariant.nombreModelo} · ${selectedVariant.descripcionColor} · T.${selectedVariant.descripcionTalla} · S/ ${priceToUse.toFixed(2)}`,
    );
  };

  const handleUpdateItemPrice = (itemId: number, raw: string) => {
    const next = Number(raw);
    if (!Number.isFinite(next) || next <= 0) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, price: Math.round(next * 100) / 100 }
          : item,
      ),
    );
  };

  const handleRemoveItem = (item: SaleItem) => {
    setItems((prev) => prev.filter((i) => i.id !== item.id));
  };

  const handleClearList = () => {
    setItems([]);
  };

  const onSubmit = async (data: VentaFormData) => {
    if (!user?.id) {
      toast.error("No se encontró el usuario autenticado. Vuelve a iniciar sesión.");
      return;
    }
    if (items.length === 0) {
      toast.error("Agrega al menos un producto a la venta");
      return;
    }

    const payload: CrearVentaProductoRequest = {
      nombreCliente: data.customerName,
      dni: data.dni,
      telefono: data.phone,
      distrito: data.district,
      provincia: data.province,
      direccion: data.address,
      usuarioId: user.id,
      items: items.map((item) => ({
        idProducto: Number(item.idProducto),
        cantidad: Number(item.qty),
        precioVenta: Number(item.price),
        observacion: item.observation,
      })),
    };
    const hasInvalidItem = payload.items.some(
      (item) =>
        !Number.isInteger(item.idProducto) ||
        item.idProducto <= 0 ||
        !Number.isFinite(item.cantidad) ||
        item.cantidad <= 0 ||
        !Number.isFinite(item.precioVenta) ||
        item.precioVenta <= 0,
    );
    if (hasInvalidItem) {
      toast.error(
        "Hay un producto con datos inválidos. Retíralo y vuelve a agregarlo.",
      );
      return;
    }

    const toastId = toast.loading("Registrando venta...");
    try {
      const response = await crearVentaProducto(payload);

      setLastSaleId(response.venta.id_venta);
      setItems([]);
      reset();
      toast.success("Venta registrada correctamente", { id: toastId });
    } catch (error) {
      toast.error(getApiErrorMessage(error), { id: toastId });
    }
  };

  const handlePrintLabel = async () => {
    if (lastSaleId === null || isPrinting) return;

    const toastId = toast.loading("Enviando etiqueta a la impresora...");
    setIsPrinting(true);
    try {
      const response = await imprimirEtiquetaVenta({ idVenta: lastSaleId });
      toast.success(
        `Etiqueta de la venta #${lastSaleId} enviada a ${response.printer}`,
        { id: toastId },
      );
    } catch (error) {
      toast.error(getApiErrorMessage(error), { id: toastId });
    } finally {
      setIsPrinting(false);
    }
  };

  const totalPairs = items.reduce((sum, item) => sum + item.qty, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.qty * item.price, 0);

  const handleApplySelectedProduct = async (
    product: GetAllBotinesInventoryResponse,
  ) => {
    const stockLoaded = await loadProductStock(product);
    if (!stockLoaded) {
      toast.error("No se pudo cargar el stock del producto");
      return;
    }

    setCurrentProduct(product);
    setQuantity(1);
    setShowSelector(false);
    setShowConfirmProduct(false);
    setPendingProduct(null);
  };

  const handleSelectFromInventory = (product: GetAllBotinesInventoryResponse) => {
    setPendingProduct(product);
    setShowConfirmProduct(true);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid min-h-0 flex-1 gap-2 lg:grid-cols-[minmax(0,3fr)_minmax(300px,1fr)]"
    >
      {/* Columna izquierda: formulario y selección */}
      <div className="grid min-h-0 gap-2 lg:grid-cols-2 lg:grid-rows-[auto_minmax(0,1fr)]">
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
        <section className="min-h-0 rounded-lg border border-[#F0E3E6] bg-white p-3 lg:col-span-2 lg:overflow-y-auto">
          <header className="mb-2 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFF3F7] text-[#984258]">
              <span className="text-sm">🧾</span>
            </div>
            <h2 className="text-[13px] font-semibold text-[#251721]">Agregar Pedido</h2>
          </header>

          <div className="space-y-2">
            {/* Card de producto seleccionada */}
            {currentProduct && (
              <div className="flex items-center justify-between border-b border-[#F0E3E6] px-1 pb-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#FFF3F7] text-[#984258]">
                    <Package size={14} />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#251721]">
                      {currentProduct.nombreModelo}{" "}
                      <span className="font-normal text-[#867275]">
                        · {currentProduct.codigoModelo}
                      </span>
                    </p>
                  </div>
                </div>
                {hasValidListPrice && (
                  <div className="text-right">
                    <p className="text-[9px] text-[#A28C8F]">Lista /par</p>
                    <p className="text-[13px] font-semibold text-[#251721]">
                      S/ {listPrice.toFixed(2)}
                    </p>
                    {Number.isFinite(purchasePrice) && purchasePrice > 0 ? (
                      <p className="text-[9px] text-[#94A3B8]">
                        Compra S/ {purchasePrice.toFixed(2)}
                      </p>
                    ) : null}
                  </div>
                )}
              </div>
            )}
            {loadingStock ? <p className="text-sm text-gray-500 mb-3">Cargando detalles de stock...</p> : null}
            {!loadingStock && Object.keys(groupedStockDetails).length > 0 ? (
              <StockDetailCard
                groupedStockDetails={groupedStockDetails}
                selectedColorId={selectedColorId}
                setSelectedColorId={setSelectedColorId}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
                reservedStockBySku={reservedStockBySku}
              />
            ) : null}

            {/* Precio editable (rebajas) */}
            {currentProduct && (
              <div className="rounded-lg border border-[#FDE68A] bg-[#FFFBEB] px-3 py-2.5">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <label
                      htmlFor="sale-price-input"
                      className="text-[10px] font-semibold uppercase tracking-wide text-[#B45309]"
                    >
                      Precio de venta (editable)
                    </label>
                    <p className="mt-0.5 text-[11px] text-[#92400E]">
                      Lista S/ {hasValidListPrice ? listPrice.toFixed(2) : "—"} · puedes
                      rebajar antes de agregar (ej. 59 o 56)
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-semibold text-[#92400E]">S/</span>
                    <input
                      id="sale-price-input"
                      type="number"
                      min={0.01}
                      step={0.01}
                      value={salePrice}
                      onChange={(e) => setSalePrice(e.target.value)}
                      className="h-9 w-[110px] rounded-lg border border-[#F59E0B] bg-white px-2 text-right text-[15px] font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/40"
                    />
                  </div>
                </div>
                {hasValidSalePrice && hasValidListPrice && salePriceNum < listPrice ? (
                  <p className="mt-1.5 text-[11px] font-medium text-[#B45309]">
                    Rebaja: −S/ {(listPrice - salePriceNum).toFixed(2)} por par
                    {Number.isFinite(purchasePrice) && purchasePrice > 0
                      ? ` · ganancia ≈ S/ ${(salePriceNum - purchasePrice).toFixed(2)}/par`
                      : ""}
                  </p>
                ) : null}
                {hasValidSalePrice &&
                Number.isFinite(purchasePrice) &&
                purchasePrice > 0 &&
                salePriceNum < purchasePrice ? (
                  <p className="mt-1 text-[11px] font-semibold text-[#DC2626]">
                    Atención: estás vendiendo por debajo del precio de compra
                  </p>
                ) : null}
              </div>
            )}

            {/* Cantidad a vender */}
            <div className="rounded-lg border border-[#F0E3E6] bg-white p-2.5 text-[12px] text-[#251721]">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F0E3E6] pb-1.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={16}
                    className={selectedVariant ? "text-[#16A34A]" : "text-[#A28C8F]"}
                  />
                  <div>
                    <p className="text-[11px] font-semibold text-[#251721]">
                      {selectedVariant
                        ? `${selectedVariant.descripcionColor} · Talla ${selectedVariant.descripcionTalla}`
                        : "Selecciona un color y una talla"}
                    </p>
                  </div>
                </div>
                {selectedVariant && (
                  <div className="text-right">
                    <p className="text-[10px] font-medium text-[#6B555A]">
                      {selectedVariant.sku}
                    </p>
                    <p className="text-[9px] text-[#A28C8F]">
                      {currentStock} disponibles
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3 md:justify-between">
                <div
                  className={`flex items-center gap-2 rounded-full bg-white px-2 py-1 ${
                    currentStock <= 0 ? "opacity-50" : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={currentStock <= 0}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-[#E0D0D4] text-[14px] text-[#251721] disabled:cursor-not-allowed"
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
                    disabled={currentStock <= 0}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-[#E0D0D4] text-[14px] text-[#251721] disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                  <span className="ml-1 text-[11px] text-[#A28C8F]">
                    de {currentStock} disponibles
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAddItem}
                    disabled={currentStock <= 0 || !hasValidSalePrice}
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
      <aside className="flex min-h-[200px] flex-col overflow-hidden rounded-lg border border-[#F0E3E6] bg-white p-3 text-sm">
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
          lastSaleId !== null ? (
            <div className="mt-1.5 flex flex-1 flex-col items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50/60 px-4 py-6 text-center">
              <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <CheckCircle2 size={22} />
              </div>
              <p className="text-[13px] font-semibold text-emerald-900">
                Venta #{lastSaleId} confirmada
              </p>
              <p className="mt-1 text-[11px] text-emerald-700">
                Ya puedes imprimir la etiqueta de 70 × 50 mm.
              </p>
              <button
                type="button"
                onClick={handlePrintLabel}
                disabled={isPrinting}
                className="mt-4 flex h-10 w-full max-w-[210px] items-center justify-center gap-2 rounded-full bg-[#984258] px-4 text-[12px] font-semibold text-white shadow-sm transition-colors hover:bg-[#7d3444] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Printer size={16} />
                <span>{isPrinting ? "Imprimiendo..." : "Imprimir etiqueta"}</span>
              </button>
            </div>
          ) : (
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
          )
        ) : (
          <>
            <div className="mt-1 flex-1 space-y-2 overflow-y-auto pr-1">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-3 rounded-xl border border-[#F3E3E7] bg-[#FFFBFD] px-3 py-2 text-[12px]"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-[#251721]">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-[#A28C8F]">
                      {item.color} · T.{item.size} · {item.qty} par
                      {item.qty !== 1 ? "es" : ""}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      <label className="text-[10px] font-medium text-[#64748B]">
                        Precio/par
                      </label>
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] text-[#64748B]">S/</span>
                        <input
                          type="number"
                          min={0.01}
                          step={0.01}
                          defaultValue={item.price}
                          key={`${item.id}-${item.price}`}
                          onBlur={(e) =>
                            handleUpdateItemPrice(item.id, e.target.value)
                          }
                          className="h-7 w-[84px] rounded-md border border-[#E2E8F0] bg-white px-1.5 text-right text-[12px] font-semibold text-[#0F172A] focus:border-[#984258] focus:outline-none"
                        />
                      </div>
                      {item.listPrice > item.price ? (
                        <span className="rounded-full bg-[#FFFBEB] px-1.5 py-0.5 text-[10px] font-medium text-[#B45309]">
                          lista S/ {item.listPrice.toFixed(0)}
                        </span>
                      ) : null}
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
                disabled={isSubmitting}
                className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#984258] text-[13px] font-semibold text-white shadow-sm shadow-[#E8839A]/40 transition-colors hover:bg-[#7d3444] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span>✔</span>
                <span>
                  {isSubmitting ? "Registrando venta..." : "Confirmar Venta Total"}
                </span>
              </button>

              <p className="mt-1 text-center text-[10px] text-[#A28C8F]">
                Se generará comprobante automático.
              </p>
            </div>
          </>
        )}
      </aside>

      {/* Selector de productos (grilla principal) */}
      {showSelector && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 p-4 overflow-y-auto">
          <div className="relative flex h-[90vh] w-full max-w-5xl flex-col rounded-2xl bg-white p-3">
            <div className="mb-2 flex items-center justify-between gap-3 px-1">
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

            <div className="mb-2 flex gap-1 rounded-lg bg-[#FFF0F6] p-1">
              {(
                [
                  { id: "botines" as const, label: "Botines" },
                  { id: "sandalias" as const, label: "Sandalias" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectorSection(tab.id)}
                  className={[
                    "flex-1 rounded-md px-3 py-1.5 text-[12px] font-semibold transition-colors border-0 cursor-pointer",
                    selectorSection === tab.id
                      ? "bg-[#984258] text-white"
                      : "bg-transparent text-[#544245] hover:bg-white/70",
                  ].join(" ")}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
              <CalzadoPanel
                key={selectorSection}
                inventoryTitle={
                  selectorSection === "sandalias"
                    ? "Inventario sandalias"
                    : "Inventario botines"
                }
                section={selectorSection}
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
              ¿Estás segura de agregar este modelo?
            </h3>
            <p className="mb-3 text-[12px] text-[#867275]">
              Revisa la información antes de continuar.
            </p>
            <div className="mb-3 space-y-2 rounded-xl border border-[#F0E3E6] bg-[#FFF9FB] p-3 text-[12px]">
              <div className="flex justify-between gap-3">
                <span className="text-[#A28C8F]">Modelo</span>
                <span className="font-semibold text-[#251721]">
                  {pendingProduct.nombreModelo} · {pendingProduct.codigoModelo}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-[#A28C8F]">Referencia</span>
                <span className="text-[#544245]">
                  {pendingProduct.descripcionColor} · Talla{" "}
                  {pendingProduct.descripcionTalla}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-[#A28C8F]">Precio por par</span>
                <span className="font-semibold text-[#251721]">
                  S/ {Number(pendingProduct.precio_venta_par).toFixed(2)}
                </span>
              </div>
            </div>
            <p className="mb-3 text-[11px] text-[#867275]">
              Luego podrás elegir el color, la talla y la cantidad.
            </p>
            <div className="flex justify-end gap-2 text-[13px]">
              <button
                type="button"
                disabled={loadingStock}
                className="rounded-full border border-[#E5E7EB] px-4 py-1.5 text-[#544245] hover:bg-[#F9F4F6] disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => {
                  setShowConfirmProduct(false);
                  setPendingProduct(null);
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={loadingStock}
                className="rounded-full bg-[#984258] px-4 py-1.5 font-semibold text-white hover:bg-[#7d3444] disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => void handleApplySelectedProduct(pendingProduct)}
              >
                {loadingStock ? "Cargando..." : "Sí, continuar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
