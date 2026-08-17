import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type FieldErrors } from "react-hook-form";
import { z } from "zod";
import type { AddProductFormData, InventorySection, StockRow } from "../types";
import {
  getBotinesColoresApi,
  getBotinesModelosApi,
  getBotinesTallasApi,
  getBotinesRangosOptionsApi,
  getBotinesTiposLoteOptionsApi,
  createBotinProductoApiInventory,
} from "@/features/gestion-botines/services/botines.service";
import { getSandaliasModelosApi, createSandaliaProductoApi } from "@/features/gestion-sandalias/services/sandalias.service";
import { getApiErrorMessage, useAuth } from "@/core";
import type {
  ModelRango,
  ModelTalla,
  ModelTipoLote,
  CrearBotinProductoRequest,
} from "@/features/gestion-botines/models/botinesInventory.model";
import { toast } from "react-hot-toast";

type Color = {
  id: number;
  name: string;
  description: string;
  image: string;
};

type ModeloOption = {
  id_model: number;
  label: string;
};

const QTY_BY_CONFIG = {
  docena: 12,
  media_docena: 6,
} as const;

type CantidadConfig = keyof typeof QTY_BY_CONFIG;

function qtyForTalla(
  size: number,
  from: number | null,
  to: number | null,
): number {
  const isPackFiveToEight =
    from === 5 && to === 8 && (size === 36 || size === 37);
  const isPackFiveToNine = from === 5 && to === 9 && size === 37;
  return isPackFiveToEight || isPackFiveToNine ? 2 : 1;
}

/** Media docena = distribución base del pack; Docena = el doble. */
function loteFactor(cantidadConfig?: string | null): number {
  if (cantidadConfig === "docena") return 2;
  if (cantidadConfig === "media_docena") return 1;
  return 0;
}

function totalParesLote(
  tallasSeleccionadas: ModelTalla[],
  from: number | null,
  to: number | null,
  cantidadConfig?: string | null,
): number {
  const factor = loteFactor(cantidadConfig);
  if (!factor || !tallasSeleccionadas.length) return 0;

  return tallasSeleccionadas.reduce((sum, talla) => {
    const size = Number(talla.desc_talla);
    return sum + qtyForTalla(size, from, to) * factor;
  }, 0);
}

const modalSchema = z
  .object({
    modelo: z.string().min(1, "Selecciona un modelo"),
    color: z.string().min(1, "Selecciona un color"),
    tallas: z.array(z.coerce.number().int()).min(1, "Selecciona al menos una talla"),
    precio: z
      .number({ error: "El precio por unidad es requerido" })
      .positive("El precio por unidad debe ser mayor que 0"),
    cantidadConfig: z.enum(["docena", "media_docena", "otro"]),
    rangoId: z.number().int().positive("Selecciona un rango"),
    tipoLoteId: z.number().int().positive("Selecciona un tipo de lote"),
    observacion: z
      .string()
      .max(100, "Máximo 100 caracteres")
      .optional()
      .or(z.literal("")),
  })
  .superRefine(() => {
    // if (data.cantidadConfig === "otro" && (!data.cantidadOtro || data.cantidadOtro < 1)) {
    //   ctx.addIssue({
    //     code: "custom",
    //     path: ["cantidadOtro"],
    //     message: "Indica la cantidad",
    //   });
    // }
  });

type ModalFormData = z.infer<typeof modalSchema>;

export const CONFIG_OPTIONS: {
  id: CantidadConfig;
  label: string;
  group: "PACKS" | "DOCENAS" ;
  icon: "clipboard" | "cube" | "disk" | "dots";
}[] = [
  { id: "docena", label: "Docena", group: "DOCENAS", icon: "cube" },
  { id: "media_docena", label: "Media Docena", group: "DOCENAS", icon: "disk" },
  // { id: "otro", label: "Otro", group: "OTRO", icon: "dots" },
];

// function toModalDefaults(editingRow?: StockRow): ModalFormData | undefined {
//   if (editingRow) {
//     const primary =
//       [editingRow.size1, editingRow.size2, editingRow.size3].sort((a, b) => b.qty - a.qty)[0] ??
//       editingRow.size1;
//     return {
//       modelo: editingRow.model,
//       color: editingRow.color,
//       tallas: [primary.size],
//       precio: 100.44,
//       cantidadConfig: "otro",
//       rangoId: undefined,
//       // cantidadOtro: primary.qty || 1,
//     };
//   }

// }



type UseAddProductModalArgs = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddProductFormData) => void | Promise<void>;
  onCreated?: () => void | Promise<void>;
  editingRow?: StockRow;
  section?: InventorySection;
};

export function useAddProductModal({
  open,
  onClose,
  onCreated,
  editingRow,
  section = "botines",
}: UseAddProductModalArgs) {
  const { user } = useAuth();
  const [colores, setColores] = useState<Color[]>([]);
  const [modelos, setModelos] = useState<ModeloOption[]>([]);
  const [tallas, setTallas] = useState<ModelTalla[]>([]);
  const [rangos, setRangos] = useState<ModelRango[]>([]);
  const [tiposLote, setTiposLote] = useState<ModelTipoLote[]>([]);



  const isEditing = !!editingRow;
  const [customModelo, setCustomModelo] = useState("");

  // El tipo genérico del formulario coincide exactamente con ModalFormData,
  // y dejamos que zodResolver infiera sus propios genéricos.
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ModalFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(modalSchema) as any,
    // defaultValues: toModalDefaults(editingRow),
  });

  const cantidadConfig = watch("cantidadConfig");
  const rangoId = watch("rangoId");
  const modelo = watch("modelo");
  const tipoLoteId = watch("tipoLoteId");
  const selectedTallas = watch("tallas") ?? [];

  const resumenQty = useMemo(() => {
    const selectedRango = rangos.find((rango) => rango.id_rango === rangoId);
    const match = selectedRango?.descripcion.match(/(\d+)\s*-\s*(\d+)/);
    const from = match ? Number(match[1]) : null;
    const to = match ? Number(match[2]) : null;

    const tallasSeleccionadas = tallas.filter((talla) =>
      selectedTallas.some((id) => Number(id) === talla.id_talla),
    );

    return totalParesLote(
      tallasSeleccionadas,
      from,
      to,
      cantidadConfig,
    );
  }, [rangos, rangoId, tallas, selectedTallas, cantidadConfig]);

  const resumenLoteLabel = useMemo(() => {
    if (cantidadConfig === "docena") return "docena";
    if (cantidadConfig === "media_docena") return "media docena";
    return null;
  }, [cantidadConfig]);

  const resumenTallasLabel = useMemo(() => {
    const count = selectedTallas.length;
    if (count === 0) return "sin talla seleccionada";
    if (count === 1) return "la talla seleccionada";
    return `las ${count} tallas seleccionadas`;
  }, [selectedTallas]);
  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    (async () => {
      try {
        const dataCol = await getBotinesColoresApi();
        if (cancelled) return;
        setColores(
          dataCol.map((c) => ({
            id: c.id_color,
            name: c.desc_color,
            description: c.desc_color,
            image: "",
          })),
        );
      } catch (error) {
        if (!cancelled) console.error(getApiErrorMessage(error));
      }
    })();

    (async () => {
      try {
        const dataModelos =
          section === "sandalias"
            ? await getSandaliasModelosApi()
            : await getBotinesModelosApi();
        if (cancelled) return;
        setModelos(
          dataModelos.map((m) => ({
            id_model: m.id_model,
            label:
              section === "sandalias"
                ? (m as { descModelSandalias: string }).descModelSandalias
                : (m as { descModelBotines: string }).descModelBotines,
          })),
        );
      } catch (error) {
        if (!cancelled) console.error(getApiErrorMessage(error));
      }
    })();

    (async ()=> {
      try {
        const dataTallas = await getBotinesTallasApi();
        if (cancelled) return;
        setTallas(dataTallas);
      } catch (error) {
        if (!cancelled) console.error(getApiErrorMessage(error));
      }
    })();

    (async () => {
      try {
        const dataRangos = await getBotinesRangosOptionsApi();
        if (cancelled) return;
        setRangos(dataRangos as ModelRango[]);
      } catch (error) {
        if (!cancelled) console.error(getApiErrorMessage(error));
      }
    })();

    (async () => {
      try {
        const dataTipos = await getBotinesTiposLoteOptionsApi();
        if (cancelled) return;
        setTiposLote(dataTipos as ModelTipoLote[]);
      } catch (error) {
        if (!cancelled) console.error(getApiErrorMessage(error));
      }
    })();

    return () => {
      cancelled = true;
    };

  }, [open, section]);


  async function OnSubmitForm(data: ModalFormData) {
    try {
      if (!user?.id) {
        toast.error("No se encontró el usuario autenticado. Vuelve a iniciar sesión.");
        return;
      }

      const selectedColor = colores.find((color) => color.name === data.color);
      const selectedRango = rangos.find((rango) => rango.id_rango === data.rangoId);
      const selectedTallas = tallas.filter((talla) => data.tallas.includes(talla.id_talla));
      const match = selectedRango?.descripcion.match(/(\d+)\s*-\s*(\d+)/);
      const from = match ? Number(match[1]) : null;
      const to = match ? Number(match[2]) : null;
      const factor = loteFactor(data.cantidadConfig);

      if (!factor) {
        toast.error("Selecciona Docena o Media Docena");
        return;
      }

      const payload: CrearBotinProductoRequest = {
        idModelo: Number(data.modelo),
        idColor: selectedColor?.id ?? 0,
        idTipoLote: data.tipoLoteId,
        idRango: data.rangoId,
        precioCompraPar: data.precio,
        precioVentaPar: data.precio,
        cantidadLotes: 1,
        observacion: data.observacion?.trim() || undefined,
        usuarioId: user.id,
        detalleTallas: selectedTallas.map((talla) => {
          const size = Number(talla.desc_talla);
          return {
            idTalla: talla.id_talla,
            cantidad: qtyForTalla(size, from, to) * factor,
          };
        }),
      };

      if (section === "sandalias") {
        await createSandaliaProductoApi(payload);
        toast.success("Sandalia creada correctamente");
      } else {
        await createBotinProductoApiInventory(payload);
        toast.success("Producto creado correctamente");
      }

      onCreated?.();
      onClose();
    } catch (error) {
      const message = getApiErrorMessage(error);
      console.error(message);
      toast.error(message);
    }
  }

  function onInvalidForm(formErrors: FieldErrors<ModalFormData>) {
    if (formErrors.precio) {
      toast.error(
        typeof formErrors.precio.message === "string"
          ? formErrors.precio.message
          : "Ingresa un precio por unidad válido",
      );
    }
  }

  

  // useEffect(() => {
  //   if (!open) return;
  //   const handler = (e: KeyboardEvent) => {
  //     if (e.key === "Escape") onClose();
  //   };
  //   document.addEventListener("keydown", handler);
  //   return () => document.removeEventListener("keydown", handler);
  // }, [open, onClose]);

  // const onValid = async (data: ModalFormData) => {
  //   const modeloFinal =
  //     data.modelo === "Otro modelo…" ? customModelo.trim() || "Modelo personalizado" : data.modelo;
  //   await onSubmit(toAddProductData({ ...data, modelo: modeloFinal }));
  //   onClose();
  // };

  return {
    open,
    onClose,
    isEditing,
    customModelo,
    setCustomModelo,
    register,
    setValue,
    handleSubmit,
    errors,
    isSubmitting,
    cantidadConfig,
    rangoId,
    modelo,
    tipoLoteId,
    resumenQty,
    resumenTallasLabel,
    resumenLoteLabel,
    modelos: modelos || [],
    colores: colores || [],
    tallas: tallas || [],
    rangos: rangos || [],
    tiposLote: tiposLote || [],
    selectedTallas,
    onSubmitForm: OnSubmitForm,
    onInvalidForm,
  };
}

export type AddProductModalViewProps = ReturnType<typeof useAddProductModal>;
