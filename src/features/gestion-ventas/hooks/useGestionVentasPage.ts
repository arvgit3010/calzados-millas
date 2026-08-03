import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  botinesSocket,
  getApiErrorMessage,
  type BotinesStockUpdate,
} from "@/core";
import type {
  GetAllBotinesInventoryResponse,
  GroupedStockDetails,
  SaleStockVariant,
} from "@/features/gestion-botines/models/botinesInventory.model";
import {
  consultaDatosModelosTallasApi,
  invalidateBotinesInventoryCache,
} from "@/features/gestion-botines/services/botines.service";

export type GestionVentasLocationState = {
  product?: GetAllBotinesInventoryResponse;
};

export function useGestionVentasPage() {
  const location = useLocation();
  const product = (location.state as GestionVentasLocationState)?.product ?? null;
  const [loadingStock, setLoadingStock] = useState(false);

  const [groupedStockDetails, setGroupedStockDetails] = useState<GroupedStockDetails>({});
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const loadProductStock = useCallback(
    async (selectedProduct: GetAllBotinesInventoryResponse): Promise<boolean> => {
      setLoadingStock(true);
      try {
        const response = await consultaDatosModelosTallasApi({
          id: selectedProduct.id_producto,
          modelo: selectedProduct.nombreModelo,
        });
        const fetchedStockDetails = (response.DetalleModeloStock ?? [])
          .map<SaleStockVariant>((item) => item);

        const newGroupedStock: GroupedStockDetails = fetchedStockDetails.reduce(
          (acc, item) => {
            if (!acc[item.idColor]) {
              acc[item.idColor] = {
                colorName: item.descripcionColor,
                sizes: {},
              };
            }
            acc[item.idColor].sizes[item.descripcionTalla] = item;
            return acc;
          },
          {} as GroupedStockDetails,
        );
        setGroupedStockDetails(newGroupedStock);

        const colorIds = Object.keys(newGroupedStock).map(Number);
        if (colorIds.length > 0) {
          const initialColorId = newGroupedStock[selectedProduct.idColor]
            ? selectedProduct.idColor
            : colorIds[0];
          const initialSizes = newGroupedStock[initialColorId].sizes;
          const initialSize =
            initialSizes[selectedProduct.descripcionTalla]?.stock_actual > 0
              ? selectedProduct.descripcionTalla
              : Object.entries(initialSizes)
                  .sort(([a], [b]) => Number(a) - Number(b))
                  .find(([, item]) => item.stock_actual > 0)?.[0];

          setSelectedColorId(initialColorId);
          setSelectedSize(initialSize ?? null);
        } else {
          setSelectedColorId(null);
          setSelectedSize(null);
        }
        return true;
      } catch (error) {
        console.error("Error fetching stock details:", getApiErrorMessage(error));
        return false;
      } finally {
        setLoadingStock(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (product) void loadProductStock(product);
  }, [loadProductStock, product]);

  useEffect(() => {
    const handleStockUpdate = (updatedProduct: BotinesStockUpdate) => {
      invalidateBotinesInventoryCache();
      setGroupedStockDetails((currentGroups) => {
        let changed = false;
        const nextGroups = { ...currentGroups };

        Object.entries(currentGroups).forEach(([colorId, colorGroup]) => {
          const matchingSize = Object.entries(colorGroup.sizes).find(
            ([, variant]) =>
              variant.idProducto === updatedProduct.id_producto ||
              variant.sku === updatedProduct.sku,
          );
          if (!matchingSize) return;

          const [size, variant] = matchingSize;
          nextGroups[Number(colorId)] = {
            ...colorGroup,
            sizes: {
              ...colorGroup.sizes,
              [size]: {
                ...variant,
                stock_actual: updatedProduct.stock_actual,
              },
            },
          };
          changed = true;
        });

        return changed ? nextGroups : currentGroups;
      });
    };

    botinesSocket.on("stock-update", handleStockUpdate);
    return () => {
      botinesSocket.off("stock-update", handleStockUpdate);
    };
  }, []);

  return {
    product,
    loadingStock,
    groupedStockDetails,
    selectedColorId,
    setSelectedColorId,
    selectedSize,
    setSelectedSize,
    loadProductStock,
  };
}

export type GestionVentasPageViewProps = ReturnType<typeof useGestionVentasPage>;
