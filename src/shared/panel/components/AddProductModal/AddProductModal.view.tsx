import { useState } from "react";
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
  "h-11 w-full appearance-none rounded-xl border border-[#DDD3D7] bg-white text-sm text-[#251721] outline-none transition focus:border-[#984258] focus:ring-2 focus:ring-[#984258]/15";

export function AddProductModalView({
  open,
  onClose,
  isEditing,
  // customModelo,
  // setCustomModelo,
  register,
  setValue,
  handleSubmit,
  errors,
  isSubmitting,
  // cantidadConfig,
  rangoId,
  tipoLoteId,
  //modelo, // modelo seleccionado
  modelos,
  colores,
  tallas,
  rangos,
  tiposLote,
  onSubmitForm,
  onInvalidForm,
}: AddProductModalViewProps) {
  const [tallasOpen, setTallasOpen] = useState(false);

  // Detecta el pack seleccionado (ej. "5-8", "5-9") para mostrar "x2" en ciertas tallas
  const selectedRango = rangos.find((r) => r.id_rango === rangoId);
  const selectedMatch = selectedRango?.descripcion.match(/(\d+)\s*-\s*(\d+)/);
  const isPackOtro =
    !!selectedRango && /otro/i.test(selectedRango.descripcion) && !selectedMatch;

  const doubleSizes = new Set<number>();
  if (selectedMatch) {
    const from = Number(selectedMatch[1]);
    const to = Number(selectedMatch[2]);

    // Pack 5-9 -> solo talla 37 x2
    if (from === 5 && to === 9) {
      doubleSizes.add(37);
    }

    // Pack 5-8 -> tallas 36 y 37 x2
    if (from === 5 && to === 8) {
      doubleSizes.add(36);
      doubleSizes.add(37);
    }
  }

  if (!open) return null;

  const configBtn = (active: boolean) =>
    `flex min-h-10 items-center gap-2 rounded-lg border px-3 py-2 text-left transition-all cursor-pointer ${
      active
        ? "border-[#984258] bg-[#FFF7F9] shadow-[0_0_0_1px_rgba(152,66,88,0.08)]"
        : "border-[#E5E0E2] bg-white hover:border-[#D78A9D] hover:bg-[#FFFAFB]"
    }`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{ background: "rgba(37, 23, 33, 0.4)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
      role="presentation"
    >
      <div
        className="max-h-[92dvh] w-full max-w-[860px] overflow-y-auto rounded-2xl border border-white/70 bg-white shadow-[0_24px_70px_rgba(37,23,33,0.24)]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-product-title"
      >
        <div className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-[#EEE7EA] bg-white/95 px-5 py-4 backdrop-blur sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#984258] shadow-sm">
              <PackagePlus size={20} className="text-white" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h2 id="add-product-title" className="text-xl font-bold leading-tight text-[#251721] sm:text-2xl">
                {isEditing ? "Editar Producto" : "Crear Nuevo Producto"}
              </h2>
              <p className="mt-0.5 text-xs text-[#867275]">Completa los detalles del inventario</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-[#867275] transition hover:bg-[#FFF0F6] hover:text-[#251721]"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmitForm, onInvalidForm)}
          noValidate
          className="space-y-5 px-5 py-5 sm:px-6"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-[1.05fr_1fr]">
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.08em] text-[#867275]">
                  Modelo
                </label>
                <div className="relative">
                  <select className={`${field} px-3 pr-9`} {...register("modelo")}>
                    <option key="modelo-placeholder" value="">
                      Selecciona un modelo
                    </option>
                    {modelos.map((m, index) => (
                      <option key={`modelo-${m.id_model}-${index}`} value={m.id_model}>
                        {m.  descModelBotines}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={12}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#867275]"
                  />
                </div>
                {errors.modelo && <p className="text-[10px] text-[#EF4444]">{errors.modelo.message}</p>}
                {/* {modelo === "Otro modelo…" && (
                  <input
                    type="text"
                    value={customModelo}
                    onChange={(e) => setCustomModelo(e.target.value)}
                    placeholder="Nombre del modelo"
                    className={`${field} mt-1 px-2 py-1.5`}
                  />
                )} */}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.08em] text-[#867275]">
                    Color
                  </label>
                  <div className="relative">
                    <select className={`${field} px-3 pr-9`} {...register("color")}>
                      <option key="color-placeholder" value="" className="text-[2px]">
                        Selecciona un color
                      </option>
                      {colores.map((c, index) => (
                        <option key={`color-${c.id}-${index}`} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={11}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#867275]"
                    />
                  </div>
                  {errors.color && <p className="text-[10px] text-[#EF4444]">{errors.color.message}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.08em] text-[#867275]">
                    Tallas
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setTallasOpen((prev) => !prev)}
                      className={`${field} flex w-full items-center justify-between px-3`}
                    >
                      <span className="inline-flex min-w-0 items-center gap-2 text-sm text-[#251721]">
                        <Ruler size={14} className="shrink-0 text-[#984258]" />
                        <span className="truncate">Selecciona las tallas</span>
                      </span>
                      <ChevronDown
                        size={11}
                        className={`text-[#867275] transition-transform ${tallasOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {tallasOpen && (
                      <div className="absolute z-20 mt-1 w-full rounded-md border border-[#E5E7EB] bg-white shadow-lg max-h-40 overflow-y-auto">
                        <div className="py-1 divide-y divide-[#F3F4F6]">
                          {tallas.map((t) => {
                            const size = Number(t.desc_talla);
                            const label = doubleSizes.has(size)
                              ? `${t.desc_talla} x2`
                              : t.desc_talla;

                            return (
                              <label
                                key={t.id_talla}
                                className="flex items-center gap-2 px-2 py-1 text-[10px] text-[#251721] cursor-pointer hover:bg-[#FFF0F6] w-full"
                              >
                                <input
                                  type="checkbox"
                                  value={String(t.id_talla)}
                                  className="h-3 w-3 rounded border-[#D1D5DB] text-[#984258] focus:ring-[#984258]/40"
                                  {...register("tallas")}
                                />
                                <span>{label}</span>
                                {isPackOtro && (
                                  <input
                                    type="number"
                                    min={1}
                                    defaultValue={1}
                                    className="ml-auto w-10 h-4 rounded border border-[#D1D5DB] text-[9px] px-1 text-right"
                                  />
                                )}
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.08em] text-[#867275]">
                  Precio por unidad
                </label>
                <input
                  type="number"
                  step="0.01"
                  min={0.01}
                  required
                  aria-invalid={Boolean(errors.precio)}
                  placeholder="S/ 0.00"
                  className={`${field} px-3 ${
                    errors.precio
                      ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/30"
                      : ""
                  }`}
                  {...register("precio", { valueAsNumber: true })}
                />
                {errors.precio && (
                  <p className="mt-0.5 text-[10px] text-[#EF4444]">
                    {errors.precio.message}
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-[#E7DEE2] bg-[#FAF7F8] p-4">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#544245]">
                Configuración de cantidad
              </p>

              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#867275]">Packs</p>
              <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {rangos.map((rango) => {
                  const active = rangoId === rango.id_rango;
                  return (
                    <button
                      key={rango.id_rango}
                      type="button"
                      onClick={() => {
                        // Marca el pack seleccionado
                        setValue("rangoId", rango.id_rango, { shouldValidate: true });

                        // Si es un pack "OTRO" (o cualquier texto sin rango numérico),
                        // limpiamos todas las tallas seleccionadas.
                        if (/otro/i.test(rango.descripcion) && !/\d+\s*-\s*\d+/.test(rango.descripcion)) {
                          setValue("tallas", [] as unknown as number[], { shouldValidate: true });
                          return;
                        }

                        // Si la descripción del rango tiene el formato "5-8", "5-9", etc.,
                        // seleccionamos automáticamente las tallas correspondientes
                        // (por ejemplo, 5-8 -> tallas 35-38, 5-9 -> tallas 35-39).
                        const match = rango.descripcion.match(/(\d+)\s*-\s*(\d+)/);
                        if (match) {
                          const from = Number(match[1]) + 30;
                          const to = Number(match[2]) + 30;

                          const tallaIds = tallas
                            .filter((t) => {
                              const size = Number(t.desc_talla);
                              return !Number.isNaN(size) && size >= from && size <= to;
                            })
                            .map((t) => t.id_talla);

                          if (tallaIds.length > 0) {
                            // React Hook Form maneja los valores de los checkboxes como strings,
                            // por eso convertimos los ids a string para que se marquen visualmente.
                            const tallaValues = tallaIds.map((id) => String(id));
                            setValue("tallas", tallaValues as unknown as number[], { shouldValidate: true });
                          } else {
                            // Si no hay tallas en el rango, aseguramos que queden todas desmarcadas.
                            setValue("tallas", [] as unknown as number[], { shouldValidate: true });
                          }
                        }
                        // Si no hace match con un rango numérico, no tocamos las tallas
                        // (caso ya cubierto arriba para "OTRO").
                      }}
                      className={configBtn(active)}
                    >
                      <ConfigIcon type="clipboard" active={active} />
                      <span className="flex-1 text-xs font-semibold text-[#251721]">
                        {`Pack ${rango.descripcion}`}
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

              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#867275]">
                Docenas
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {tiposLote.map((tipo) => {
                  const isMedia = tipo.descripcion.toUpperCase().includes("MEDIA");
                  const configId = isMedia ? "media_docena" : "docena";
                  const active = tipoLoteId === tipo.id_tipo;
                  return (
                    <button
                      key={tipo.id_tipo}
                      type="button"
                      onClick={() => {
                        setValue("tipoLoteId", tipo.id_tipo, { shouldValidate: true });
                        setValue("cantidadConfig", configId, { shouldValidate: true });
                      }}
                      className={configBtn(active)}
                    >
                      <ConfigIcon type={isMedia ? "disk" : "cube"} active={active} />
                      <span className="flex-1 text-xs font-semibold text-[#251721]">
                        {tipo.descripcion.toUpperCase() === "DOCENA" ? "Docena" : "Media Docena"}
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

              {/* <p className="text-[7px] font-bold uppercase tracking-wider text-[#867275] mb-1">Otro</p> */}
              {/* <button
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
              </button> */}
              {/* {cantidadConfig === "otro" && (
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
              )} */}
            </div>
          </div>

          <div className="flex gap-3 rounded-xl border border-[#F1D7DF] bg-[#FFF4F7] px-4 py-3">
            <Info size={16} className="mt-px shrink-0 text-[#984258]" aria-hidden="true" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#984258]">Resumen</p>
              <p className="mt-1 text-xs leading-relaxed text-[#544245]">
                Se añadirá con <strong className="text-[#251721]">{0 || 0} pares</strong> en
                la talla seleccionada.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-[#EEE7EA] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-3 py-2 text-xs font-bold text-[#867275] transition hover:bg-[#FFF0F6] hover:text-[#251721]"
            >
              <X size={12} />
              Cerrar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border-0 bg-[#984258] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#7A2E45] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
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
