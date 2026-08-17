import {
  CalzadoPanel,
  InventoryManagementLayout,
  type AddProductFormData,
  type StockRow,
} from "@/shared/panel";

type GestionBotinesPageViewProps = {
  title: string;
  inventoryTitle: string;
  rows: StockRow[];
  addProduct: (data: AddProductFormData) => void;
  updateProduct: (id: number, data: AddProductFormData) => void;
  deleteProduct: (id: number) => void;
};

export function GestionBotinesPageView({
  title,
  inventoryTitle,
  rows,
  addProduct,
  updateProduct,
  deleteProduct,
}: GestionBotinesPageViewProps) {
  return (
    <InventoryManagementLayout title={title} rows={rows}>
      <CalzadoPanel
        rows={rows}
        inventoryTitle={inventoryTitle}
        section="botines"
        onAddProduct={addProduct}
        onEditProduct={updateProduct}
        onDeleteProduct={deleteProduct}
      />
    </InventoryManagementLayout>
  );
}
