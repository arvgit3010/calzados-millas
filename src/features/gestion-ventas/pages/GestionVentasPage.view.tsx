import { PanelVentas } from "@/shared/panel/components/ventasPoducto/panelVentas";
import type { GestionVentasPageViewProps } from "../hooks/useGestionVentasPage";

export function GestionVentasPageView({
  product,
  loadingStock,
  groupedStockDetails,
  selectedColorId,
  setSelectedColorId,
  selectedSize,
  setSelectedSize,
  loadProductStock,
}: GestionVentasPageViewProps) {
  return (
    <section className="min-h-dvh bg-[#FFF7F9] p-3 lg:h-dvh lg:overflow-hidden lg:px-5 lg:py-2">
      <div className="mx-auto flex h-full w-full max-w-[1600px] flex-col">
        <h1 className="mb-0.5 shrink-0 text-xl font-bold text-[#251721]">
          Gestión de Ventas
        </h1>
        <p className="mb-2 shrink-0 text-[12px] text-[#867275]">
          {product
            ? `Producto seleccionado:`
            : "Selecciona un producto del inventario para ver los detalles de stock."}
        </p>
        <PanelVentas
          product={product}
          loadingStock={loadingStock}
          groupedStockDetails={groupedStockDetails}
          selectedColorId={selectedColorId}
          setSelectedColorId={setSelectedColorId}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          loadProductStock={loadProductStock}
        />
      </div>
    </section>
  );
}
