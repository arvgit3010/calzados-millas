import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { AddProductFormData, StockRow } from "../types";
import { getBotinesColores, getBotinesModelos, getBotinesTallas } from "@/features/gestion-botines/services/botines.service";
import { getApiErrorMessage } from "@/core";
import type { ModelBotin, ModelTalla } from "@/features/gestion-botines/models/botinesInventory.model";

// const TALLAS = [35, 36, 37, 38, 39] as const;
// const COLORES = ["Negro", "Beige", "Blanco", "Marrón", "Rojo", "Azul"] as const;
// const MODELOS = [
//   "Sandalia Casual S-001",
//   "Sandalia Elegante S-002",
//   "Botin Chelsea B-101",
//   "Botin Clasico B-102",
//   "Otro modelo…",
// ] as const;


type Color = {
  id: number;
  name: string;
  description: string;
  image: string;

}

const QTY_BY_CONFIG = {
  pack_5_9: 9,
  pack_5_8: 8,
  docena: 12,
  media_docena: 6,
  otro: 0,
} as const;

type CantidadConfig = keyof typeof QTY_BY_CONFIG;

const modalSchema = z
  .object({
    modelo: z.string().min(1, "Selecciona un modelo"),
    color: z.string().min(1, "Selecciona un color"),
    talla: z.number().int().min(35).max(39),
    precio: z.number().min(0, "Precio inválido"),
    cantidadConfig: z.enum(["pack_5_9", "pack_5_8", "docena", "media_docena", "otro"]),
    cantidadOtro: z.number().int().min(0).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.cantidadConfig === "otro" && (!data.cantidadOtro || data.cantidadOtro < 1)) {
      ctx.addIssue({
        code: "custom",
        path: ["cantidadOtro"],
        message: "Indica la cantidad",
      });
    }
  });

type ModalFormData = z.infer<typeof modalSchema>;

export const CONFIG_OPTIONS: {
  id: CantidadConfig;
  label: string;
  group: "PACKS" | "DOCENAS" | "OTRO";
  icon: "clipboard" | "cube" | "disk" | "dots";
}[] = [
  { id: "pack_5_9", label: "Pack 5_9", group: "PACKS", icon: "clipboard" },
  { id: "pack_5_8", label: "Pack 5_8", group: "PACKS", icon: "clipboard" },
  { id: "docena", label: "Docena", group: "DOCENAS", icon: "cube" },
  { id: "media_docena", label: "Media Docena", group: "DOCENAS", icon: "disk" },
  { id: "otro", label: "Otro", group: "OTRO", icon: "dots" },
];

function toModalDefaults(editingRow?: StockRow): ModalFormData {
  if (editingRow) {
    const primary =
      [editingRow.size1, editingRow.size2, editingRow.size3].sort((a, b) => b.qty - a.qty)[0] ??
      editingRow.size1;
    return {
      modelo: editingRow.model,
      color: editingRow.color,
      talla: primary.size,
      precio: 100.44,
      cantidadConfig: "otro",
      cantidadOtro: primary.qty || 1,
    };
  }
  return {
    modelo: "",
    color: "Negro",
    talla: 36,
    precio: 0,
    cantidadConfig: "pack_5_9",
    cantidadOtro: 0,
  };
}

// function toAddProductData(data: ModalFormData): AddProductFormData {
//   const qty =
//     data.cantidadConfig === "otro" ? (data.cantidadOtro ?? 0) : QTY_BY_CONFIG[data.cantidadConfig];

//   return {
//     modelo: data.modelo,
//     color: data.color,
//     temporada: "Verano 2024",
//     precio: data.precio,
//     pares: [],
//     // TALLAS.map((talla) => ({
//     //   talla,
//     //   cantidad: talla === data.talla ? qty : 0,
//     // })),
//   };
// }

type UseAddProductModalArgs = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddProductFormData) => void | Promise<void>;
  editingRow?: StockRow;
};

export function useAddProductModal({open,onClose,editingRow}: UseAddProductModalArgs) {
  const [colores, setColores] = useState<Color[]>([]);
  const [modelos, setModelos] = useState<ModelBotin[]>([]);
  const [tallas, setTallas] = useState<ModelTalla[]>([]);



  const isEditing = !!editingRow;
  const [customModelo, setCustomModelo] = useState("");

  const {register,watch,setValue,    formState: { errors, isSubmitting } } = useForm<ModalFormData>({
    resolver: zodResolver(modalSchema),
    defaultValues: toModalDefaults(editingRow),
  });

  const cantidadConfig = watch("cantidadConfig");
  const modelo = watch("modelo");
  // const cantidadOtro = watch("cantidadOtro");

  // const resumenQty = useMemo(() => {
  //   if (cantidadConfig === "otro") return cantidadOtro || 0;
  //   return QTY_BY_CONFIG[cantidadConfig];
  // }, [cantidadConfig, cantidadOtro]);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    (async () => {
      try {
        const dataCol = await getBotinesColores();
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

    (async ()=> {
      try {
        const dataModelos = await getBotinesModelos();
        if (cancelled) return;
        setModelos(dataModelos);
   
      } catch (error) {
        if (!cancelled) console.error(getApiErrorMessage(error));
      }
    })();

    (async ()=> {
      try {
        const dataTallas = await getBotinesTallas();
        if (cancelled) return;
        setTallas(dataTallas);
      } catch (error) {
        if (!cancelled) console.error(getApiErrorMessage(error));
      }
    })();

    return () => {
      cancelled = true;
    };

  }, [open]);

  

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
    errors,
    isSubmitting,
    cantidadConfig,
    modelo,
    // resumenQty,
    modelos: modelos || [],
    colores: colores || [],
    tallas: tallas || [],
    onSubmitForm: () => {},
  };
}

export type AddProductModalViewProps = ReturnType<typeof useAddProductModal>;
