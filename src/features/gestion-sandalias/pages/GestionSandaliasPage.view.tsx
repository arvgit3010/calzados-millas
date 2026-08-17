import {
  CalzadoPanel,
  InventoryManagementLayout,
  type AddProductFormData,
  type StockRow,
} from "@/shared/panel";

type GestionSandaliasPageViewProps = {
  title: string;
  inventoryTitle: string;
  section: "sandalias";
  rows: StockRow[];
  addProduct: (data: AddProductFormData) => void;
  updateProduct: (id: number, data: AddProductFormData) => void;
  deleteProduct: (id: number) => void;
};

export function GestionSandaliasPageView({
  title,
  inventoryTitle,
  section,
  rows,
  addProduct,
  updateProduct,
  deleteProduct,
}: GestionSandaliasPageViewProps) {
  return (
    <InventoryManagementLayout title={title} rows={rows}>
      <CalzadoPanel
        rows={rows}
        inventoryTitle={inventoryTitle}
        section={section}
        onAddProduct={addProduct}
        onEditProduct={updateProduct}
        onDeleteProduct={deleteProduct}
      />
    </InventoryManagementLayout>
  );
}
