import { PanelVentas } from "@/shared/panel/components/ventasPoducto/panelVentas";
import type { GestionVentasPageViewProps } from "../hooks/useGestionVentasPage";

export function GestionVentasPageView({ product }: GestionVentasPageViewProps) {
  return (
    <section className="min-h-dvh bg-[#FFF7F9] p-4 md:p-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-1 text-xl font-bold text-[#251721]">Gestión de Ventas</h1>
        <p className="mb-4 text-[13px] text-[#867275]">
          {product
            ? `Venta de ${product.nombreModelo} · ${product.descripcionColor} · Talla ${product.descripcionTalla}`
            : "Selecciona un producto desde el inventario para vender"}
        </p>
        <PanelVentas />
      </div>
    </section>
  );
}
