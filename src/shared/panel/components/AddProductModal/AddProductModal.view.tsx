import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ClipboardList,
  Cuboid,
  Info,
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
  const color = active ? "text-[#984258]" : "text-[#B89AA1]";
  if (type === "clipboard") return <ClipboardList size={13} className={color} />;
  if (type === "cube") return <Cuboid size={13} className={color} />;
  if (type === "disk") return <Save size={13} className={color} />;
  return <span className={`text-[10px] font-semibold leading-none ${color}`}>···</span>;
}

const labelCls = "mb-1 block text-[10px] font-medium tracking-wide text-[#8A7A7E]";

/** Inputs claros, línea fina, tamaño compacto */
const field =
  "h-8 w-full appearance-none rounded-md border border-[#EDE6E8] bg-white px-2.5 text-[12px] text-[#3A3033] outline-none transition placeholder:text-[#B5A8AB] focus:border-[#E2B8C2] focus:bg-[#FFFBFC]";

function isTallaSelected(selected: Array<number | string>, id: number) {
  return selected.some((value) => Number(value) === id);
}

function tallaChipClass(active: boolean) {
  return `inline-flex min-w-[2.25rem] items-center justify-center rounded-md border px-2 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
    active
      ? "border-[#C47A8C] bg-[#F8E9EE] text-[#984258]"
      : "border-[#EDE6E8] bg-white text-[#6B5A5E] hover:bg-[#FFFBFC]"
  }`;
}

export function AddProductModalView({
  open,
  onClose,
  isEditing,
  register,
  setValue,
  handleSubmit,
  errors,
  isSubmitting,
  rangoId,
  tipoLoteId,
  resumenQty,
  resumenTallasLabel,
  resumenLoteLabel,
  modelos,
  colores,
  tallas,
  rangos,
  tiposLote,
  selectedTallas,
  onSubmitForm,
  onInvalidForm,
}: AddProductModalViewProps) {
  const [tallasOpen, setTallasOpen] = useState(false);
  const tallasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tallasOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (tallasRef.current && !tallasRef.current.contains(event.target as Node)) {
        setTallasOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [tallasOpen]);

  const toggleTalla = (id: number) => {
    const current = selectedTallas ?? [];
    const next = isTallaSelected(current, id)
      ? current.filter((value) => Number(value) !== id)
      : [...current, id];

    setValue("tallas", next as number[], { shouldValidate: true });
  };

  const selectedRango = rangos.find((r) => r.id_rango === rangoId);
  const selectedMatch = selectedRango?.descripcion.match(/(\d+)\s*-\s*(\d+)/);
  const isPackOtro =
    !!selectedRango && /otro/i.test(selectedRango.descripcion) && !selectedMatch;

  const doubleSizes = new Set<number>();
  if (selectedMatch) {
    const from = Number(selectedMatch[1]);
    const to = Number(selectedMatch[2]);

    if (from === 5 && to === 9) {
      doubleSizes.add(37);
    }

    if (from === 5 && to === 8) {
      doubleSizes.add(36);
      doubleSizes.add(37);
    }
  }

  const selectedTallaLabels = tallas
    .filter((t) => isTallaSelected(selectedTallas, t.id_talla))
    .map((t) => {
      const size = Number(t.desc_talla);
      return doubleSizes.has(size) ? `${t.desc_talla} x2` : t.desc_talla;
    });

  if (!open) return null;

  const configBtn = (active: boolean) =>
    `flex min-h-[2.1rem] items-center gap-2 rounded-md border px-2 py-1.5 text-left transition-colors cursor-pointer ${
      active
        ? "border-[#E2B8C2] bg-[#FFF7F9]"
        : "border-[#EDE6E8] bg-white hover:bg-[#FFFBFC]"
    }`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#251721]/28 p-4 sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex max-h-[90dvh] w-full max-w-[760px] flex-col overflow-hidden rounded-lg border border-[#F0E8EB] bg-white"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-product-title"
      >
        {/* Cabecera suave — sin X */}
        <header className="shrink-0 border-b border-[#F0E8EB] bg-[#FFF5F7] px-4 py-2.5">
          <h2
            id="add-product-title"
            className="m-0 text-[12px] font-semibold uppercase tracking-[0.06em] text-[#984258]"
          >
            {isEditing ? "Inventario — Editar producto" : "Inventario — Crear nuevo producto"}
          </h2>
        </header>

        <form
          onSubmit={handleSubmit(onSubmitForm, onInvalidForm)}
          noValidate
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3.5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:items-start">
              {/* Sección: datos */}
              <section className="rounded-md border border-[#EDE6E8] bg-[#FFFBFC] p-3.5">
                <p className="mb-2.5 text-[11px] font-semibold text-[#6B5A5E]">
                  Datos del producto
                </p>

                <div className="flex flex-col gap-2.5">
                  <div>
                    <label className={labelCls}>Modelo</label>
                    <div className="relative">
                      <select className={`${field} pr-7`} {...register("modelo")}>
                        <option key="modelo-placeholder" value="">
                          Selecciona un modelo
                        </option>
                        {modelos.map((m, index) => (
                          <option
                            key={`modelo-${m.id_model}-${index}`}
                            value={m.id_model}
                          >
                            {m.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={11}
                        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#B5A8AB]"
                      />
                    </div>
                    {errors.modelo && (
                      <p className="mt-0.5 text-[10px] text-[#C45C6A]">
                        {errors.modelo.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={labelCls}>Color</label>
                    <div className="relative">
                      <select className={`${field} pr-7`} {...register("color")}>
                        <option key="color-placeholder" value="">
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
                        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#B5A8AB]"
                      />
                    </div>
                    {errors.color && (
                      <p className="mt-0.5 text-[10px] text-[#C45C6A]">
                        {errors.color.message}
                      </p>
                    )}
                  </div>

                  <div ref={tallasRef}>
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <label className="text-[10px] font-medium tracking-wide text-[#8A7A7E]">
                        Tallas
                      </label>
                      {selectedTallaLabels.length > 0 ? (
                        <span className="text-[10px] font-medium text-[#984258]">
                          {selectedTallaLabels.length} seleccionada
                          {selectedTallaLabels.length === 1 ? "" : "s"}
                        </span>
                      ) : null}
                    </div>

                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setTallasOpen((prev) => !prev)}
                        className={`${field} flex w-full items-center justify-between gap-2 text-left ${
                          tallasOpen ? "border-[#E2B8C2] bg-[#FFFBFC]" : ""
                        }`}
                      >
                        <span className="inline-flex min-w-0 flex-1 items-center gap-1.5">
                          <Ruler size={12} className="shrink-0 text-[#C4A4AC]" />
                          {selectedTallaLabels.length > 0 ? (
                            <span className="truncate text-[12px] font-medium text-[#3A3033]">
                              {selectedTallaLabels.join(", ")}
                            </span>
                          ) : (
                            <span className="truncate text-[12px] text-[#B5A8AB]">
                              Selecciona las tallas
                            </span>
                          )}
                        </span>
                        <ChevronDown
                          size={11}
                          className={`shrink-0 text-[#B5A8AB] transition-transform ${
                            tallasOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {tallasOpen && (
                        <div className="absolute z-20 mt-1 w-full rounded-md border border-[#EDE6E8] bg-white p-2">
                          <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
                            {tallas.map((t) => {
                              const size = Number(t.desc_talla);
                              const label = doubleSizes.has(size)
                                ? `${t.desc_talla} x2`
                                : t.desc_talla;
                              const active = isTallaSelected(selectedTallas, t.id_talla);

                              return (
                                <div key={t.id_talla} className="flex flex-col gap-1">
                                  <button
                                    type="button"
                                    onClick={() => toggleTalla(t.id_talla)}
                                    className={tallaChipClass(active)}
                                  >
                                    {label}
                                  </button>
                                  {isPackOtro && active && (
                                    <input
                                      type="number"
                                      min={1}
                                      defaultValue={1}
                                      className="h-6 w-full rounded-md border border-[#EDE6E8] bg-white px-1 text-center text-[11px] text-[#3A3033] outline-none focus:border-[#E2B8C2]"
                                    />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                    {errors.tallas && (
                      <p className="mt-0.5 text-[10px] text-[#C45C6A]">
                        {errors.tallas.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={labelCls}>Precio por unidad</label>
                    <input
                      type="number"
                      step="0.01"
                      min={0.01}
                      required
                      aria-invalid={Boolean(errors.precio)}
                      placeholder="S/ 0.00"
                      className={`${field} ${
                        errors.precio ? "border-[#E8A0A8]" : ""
                      }`}
                      {...register("precio", { valueAsNumber: true })}
                    />
                    {errors.precio && (
                      <p className="mt-0.5 text-[10px] text-[#C45C6A]">
                        {errors.precio.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={labelCls}>Observación</label>
                    <input
                      type="text"
                      maxLength={100}
                      placeholder="Ej: lote dañado, pedido especial…"
                      className={field}
                      {...register("observacion")}
                    />
                    {errors.observacion && (
                      <p className="mt-0.5 text-[10px] text-[#C45C6A]">
                        {errors.observacion.message}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* Sección: cantidad */}
              <section className="rounded-md border border-[#EDE6E8] bg-[#FFFBFC] p-3.5">
                <p className="mb-2.5 text-[11px] font-semibold text-[#6B5A5E]">
                  Configuración de cantidad
                </p>

                <p className="mb-1.5 text-[10px] font-medium tracking-wide text-[#8A7A7E]">
                  Packs
                </p>
                <div className="mb-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  {rangos.map((rango) => {
                    const active = rangoId === rango.id_rango;
                    return (
                      <button
                        key={rango.id_rango}
                        type="button"
                        onClick={() => {
                          setValue("rangoId", rango.id_rango, { shouldValidate: true });

                          if (
                            /otro/i.test(rango.descripcion) &&
                            !/\d+\s*-\s*\d+/.test(rango.descripcion)
                          ) {
                            setValue("tallas", [], { shouldValidate: true });
                            return;
                          }

                          const match = rango.descripcion.match(/(\d+)\s*-\s*(\d+)/);
                          if (match) {
                            const from = Number(match[1]) + 30;
                            const to = Number(match[2]) + 30;

                            const tallaIds = tallas
                              .filter((t) => {
                                const size = Number(t.desc_talla);
                                return (
                                  !Number.isNaN(size) && size >= from && size <= to
                                );
                              })
                              .map((t) => t.id_talla);

                            setValue("tallas", tallaIds.length > 0 ? tallaIds : [], {
                              shouldValidate: true,
                            });
                          }
                        }}
                        className={configBtn(active)}
                      >
                        <ConfigIcon type="clipboard" active={active} />
                        <span className="flex-1 text-[11px] font-medium text-[#3A3033]">
                          {`Pack ${rango.descripcion}`}
                        </span>
                        <span
                          className={`h-3 w-3 shrink-0 rounded-full border ${
                            active
                              ? "border-[#C47A8C] bg-[#C47A8C]"
                              : "border-[#D8CED1] bg-white"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                <p className="mb-1.5 text-[10px] font-medium tracking-wide text-[#8A7A7E]">
                  Docenas
                </p>
                <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
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
                        <span className="flex-1 text-[11px] font-medium text-[#3A3033]">
                          {tipo.descripcion.toUpperCase() === "DOCENA"
                            ? "Docena"
                            : "Media Docena"}
                        </span>
                        <span
                          className={`h-3 w-3 shrink-0 rounded-full border ${
                            active
                              ? "border-[#C47A8C] bg-[#C47A8C]"
                              : "border-[#D8CED1] bg-white"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>

            {/* Resumen */}
            <div className="flex items-start gap-2 rounded-md border border-[#EDE6E8] bg-[#FFF8FA] px-3 py-2">
              <Info size={13} className="mt-0.5 shrink-0 text-[#C47A8C]" aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-[10px] font-semibold tracking-wide text-[#984258]">
                  Resumen
                </p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-[#6B5A5E]">
                  {resumenQty > 0 ? (
                    <>
                      Se añadirá con{" "}
                      <span className="font-semibold text-[#3A3033]">
                        {resumenQty} pares
                      </span>
                      {resumenLoteLabel ? (
                        <>
                          {" "}
                          <span className="font-semibold text-[#3A3033]">
                            {resumenLoteLabel}
                          </span>
                          )
                        </>
                      ) : null}{" "}
                      en {resumenTallasLabel}.
                    </>
                  ) : (
                    <>
                      Selecciona pack, tallas y{" "}
                      <span className="font-semibold text-[#3A3033]">Docena</span> o{" "}
                      <span className="font-semibold text-[#3A3033]">Media Docena</span>{" "}
                      para ver el resumen.
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Footer: botones pequeños y alineados */}
          <footer className="flex shrink-0 items-center justify-end gap-2 border-t border-[#F0E8EB] bg-[#FFFBFC] px-4 py-2.5">
            <button
              type="button"
              onClick={onClose}
              className="btn-pastel btn-pastel--cancel"
            >
              <X size={12} strokeWidth={2} />
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-pastel btn-pastel--save"
            >
              <Save size={12} strokeWidth={2} />
              {isSubmitting
                ? "Guardando…"
                : isEditing
                  ? "Guardar cambios"
                  : "Guardar producto"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
