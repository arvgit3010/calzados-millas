import { useInventoryCrud } from "@/shared/panel";

export function useGestionSandaliasPage() {
  // Sin datos todavía: cuando exista API, cargar aquí como botines.
  const crud = useInventoryCrud(() => []);

  return {
    title: "",
    inventoryTitle: "Inventario de Sandalias",
    section: "sandalias" as const,
    rows: crud.rows,
    addProduct: crud.add,
    updateProduct: crud.update,
    deleteProduct: crud.remove,
  };
}
