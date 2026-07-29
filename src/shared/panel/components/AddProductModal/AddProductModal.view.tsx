import {
  ChevronDown,
  ClipboardList,
  Cuboid,
  Info,
  PackagePlus,
  Ruler,
  Save,
  X,
} from "lucide-react";
import { CONFIG_OPTIONS, type AddProductModalViewProps } from "../../hooks/useAddProductModal";

function ConfigIcon({
  type,
  active,
}: {
  type: (typeof CONFIG_OPTIONS)[number]["icon"];
  active: boolean;
}) {
  const color = active ? "text-[#984258]" : "text-[#E8839A]";
  if (type === "clipboard") return <ClipboardList size={13} className={color} />;
  if (type === "cube") return <Cuboid size={13} className={color} />;
  if (type === "disk") return <Save size={13} className={color} />;
  return <span className={`text-[10px] font-bold leading-none ${color}`}>···</span>;
}

const field =
  "w-full appearance-none border border-[#E5E7EB] rounded-lg text-[12px] text-[#251721] bg-white outline-none focus:ring-1 focus:ring-[#984258]/30 focus:border-[#984258]";

export function AddProductModalView({
  open,
  onClose,
  isEditing,
  customModelo,
  setCustomModelo,
  register,
  setValue,
  errors,
  isSubmitting,
  cantidadConfig,
  modelo,
  // resumenQty,
  modelos,
  colores,
  tallas,
  onSubmitForm,
}: AddProductModalViewProps) {
  if (!open) return null;

  const configBtn = (active: boolean) =>
    `flex items-center gap-1.5 rounded-md border px-2 py-1.5 text-left transition-all cursor-pointer ${
      active
        ? "border-[#984258] bg-white shadow-sm"
        : "border-[#E5E7EB] bg-white hover:border-[#E8839A]"
    }`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3"
      style={{ background: "rgba(37, 23, 33, 0.4)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-[760px] max-h-[90dvh] overflow-y-auto bg-white rounded-xl shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-product-title"
      >
        <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-md bg-[#984258] flex items-center justify-center shrink-0">
              <PackagePlus size={14} className="text-white" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h2 id="add-product-title" className="text-[13px] font-bold text-[#251721] leading-tight">
                {isEditing ? "Editar Producto" : "Crear Nuevo Producto"}
              </h2>
              <p className="text-[10px] text-[#867275] leading-tight">Detalles del inventario</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-[#867275] hover:text-[#251721] hover:bg-[#FFF0F6] border-0 bg-transparent cursor-pointer"
            aria-label="Cerrar"
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={onSubmitForm} className="px-3.5 py-3 space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="space-y-2">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#867275] mb-0.5">
                  Modelo
                </label>
                <div className="relative">
                  <select className={`${field} px-2 py-1.5 pr-7`} {...register("modelo")}>
                    <option value="">Selecciona un modelo</option>
                    {modelos.map((m) => (
                      <option key={m.id_modelo} value={m.id_modelo}>
                        {m.  descModelBotines}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={12}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[#867275] pointer-events-none"
                  />
                </div>
                {errors.modelo && <p className="text-[10px] text-[#EF4444]">{errors.modelo.message}</p>}
                {modelo === "Otro modelo…" && (
                  <input
                    type="text"
                    value={customModelo}
                    onChange={(e) => setCustomModelo(e.target.value)}
                    placeholder="Nombre del modelo"
                    className={`${field} mt-1 px-2 py-1.5`}
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#867275] mb-0.5">
                    Color
                  </label>
                  <div className="relative">
                    <select className={`${field} px-2 py-1.5 pr-7`} {...register("color")}>
                      <option value=""  className="text-[2px]">Selecciona un color</option>
                      {colores.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={11}
                      className="absolute right-1 top-1/2 -translate-y-1/2 text-[#867275] pointer-events-none"
                    />
                  </div>
                  {errors.color && <p className="text-[10px] text-[#EF4444]">{errors.color.message}</p>}
                </div>
                <div>
                  <label className="block text-[8px] font-bold uppercase tracking-wider text-[#867275] mb-0.5">
                    Talla
                  </label>
                  <div className="relative">
                    <Ruler
                      size={11}
                      className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[#984258]"
                    />
                    <select
                      className={`${field} pl-6 pr-5 py-1.5`}
                      {...register("talla", { valueAsNumber: true })}
                    >
                      {tallas.map((t) => (
                        <option key={t.id_talla} value={t.id_talla}>
                          {t.desc_talla}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={11}
                      className="absolute right-1 top-1/2 -translate-y-1/2 text-[#867275] pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[8px] font-bold uppercase tracking-wider text-[#867275] mb-0.5">
                  Precio por unidad
                </label>
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  placeholder="S/ 0.00"
                  className={`${field} px-2 py-1.5`}
                  {...register("precio", { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="rounded-lg bg-[#F8F4F6] border border-[#E5E7EB] p-2">
              <p className="text-[8px] font-bold uppercase tracking-wider text-[#544245] mb-1.5">
                Configuración de cantidad
              </p>

              <p className="text-[7px] font-bold uppercase tracking-wider text-[#867275] mb-1">Packs</p>
              <div className="grid grid-cols-2 gap-1 mb-1.5">
                {CONFIG_OPTIONS.filter((o) => o.group === "PACKS").map((opt) => {
                  const active = cantidadConfig === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setValue("cantidadConfig", opt.id, { shouldValidate: true })}
                      className={configBtn(active)}
                    >
                      <ConfigIcon type={opt.icon} active={active} />
                      <span className="text-[10px] font-semibold text-[#251721] flex-1">
                        {opt.label}
                      </span>
                      <span
                        className={`w-2.5 h-2.5 rounded-full border shrink-0 ${
                          active ? "border-[#984258] bg-[#984258]" : "border-[#D1D5DB]"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <p className="text-[7px] font-bold uppercase tracking-wider text-[#867275] mb-1">
                Docenas
              </p>
              <div className="grid grid-cols-2 gap-1 mb-1.5">
                {CONFIG_OPTIONS.filter((o) => o.group === "DOCENAS").map((opt) => {
                  const active = cantidadConfig === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setValue("cantidadConfig", opt.id, { shouldValidate: true })}
                      className={configBtn(active)}
                    >
                      <ConfigIcon type={opt.icon} active={active} />
                      <span className="text-[10px] font-semibold text-[#251721] flex-1">
                        {opt.label}
                      </span>
                      <span
                        className={`w-2.5 h-2.5 rounded-full border shrink-0 ${
                          active ? "border-[#984258] bg-[#984258]" : "border-[#D1D5DB]"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <p className="text-[7px] font-bold uppercase tracking-wider text-[#867275] mb-1">Otro</p>
              <button
                type="button"
                onClick={() => setValue("cantidadConfig", "otro", { shouldValidate: true })}
                className={`w-full ${configBtn(cantidadConfig === "otro")}`}
              >
                <ConfigIcon type="dots" active={cantidadConfig === "otro"} />
                <span className="text-[10px] font-semibold text-[#251721] flex-1">Otro</span>
                <span
                  className={`w-2.5 h-2.5 rounded-full border shrink-0 ${
                    cantidadConfig === "otro" ? "border-[#984258] bg-[#984258]" : "border-[#D1D5DB]"
                  }`}
                />
              </button>
              {cantidadConfig === "otro" && (
                <input
                  type="number"
                  min={1}
                  placeholder="Cantidad de pares"
                  className={`${field} mt-1 px-2 py-1.5`}
                  {...register("cantidadOtro", { valueAsNumber: true })}
                />
              )}
              {errors.cantidadOtro && (
                <p className="text-[10px] text-[#EF4444] mt-0.5">{errors.cantidadOtro.message}</p>
              )}
            </div>
          </div>

          <div className="flex gap-1.5 rounded-md border border-[#F5DCE9] bg-[#FFF0F6] px-2 py-1.5">
            <Info size={12} className="shrink-0 text-[#984258] mt-px" aria-hidden="true" />
            <div>
              <p className="text-[8px] font-bold uppercase tracking-wider text-[#984258]">Resumen</p>
              <p className="text-[10px] text-[#544245] leading-snug">
                Se añadirá con <strong className="text-[#251721]">{0 || 0} pares</strong> en
                la talla seleccionada.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#867275] hover:text-[#251721] hover:bg-[#FFF0F6] rounded-md border-0 bg-transparent cursor-pointer"
            >
              <X size={12} />
              Cerrar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#984258] text-white text-[10px] font-bold uppercase tracking-wider rounded-md hover:bg-[#7A2E45] disabled:opacity-60 border-0 cursor-pointer"
            >
              <Save size={12} />
              {isSubmitting ? "Guardando…" : isEditing ? "Guardar" : "Guardar producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
