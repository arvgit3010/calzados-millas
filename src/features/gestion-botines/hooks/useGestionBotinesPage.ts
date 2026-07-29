import { useInventoryCrud } from "@/shared/panel";

export function useGestionBotinesPage() {
  // El listado se carga desde el API en useCalzadoPanel (getBotinesInventory).
  // Aquí el CRUD solo gestiona altas/ediciones/bajas locales.
  const crud = useInventoryCrud(() => []);

  return {
    title: "",
    inventoryTitle: "Inventario de Botines",
    section: "botines" as const,
    rows: crud.rows,
    addProduct: crud.add,
    updateProduct: crud.update,
    deleteProduct: crud.remove,
  };
}
