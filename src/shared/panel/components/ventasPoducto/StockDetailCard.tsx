import type { GroupedStockDetails } from "@/features/gestion-botines/models/botinesInventory.model";
import {
  getStockStatus,
  STOCK_STATUS_CONFIG,
} from "@/shared/panel/utils/stockStatus";

interface StockDetailCardProps {
  groupedStockDetails: GroupedStockDetails;
  selectedColorId: number | null;
  setSelectedColorId: (id: number) => void;
  selectedSize: string | null;
  setSelectedSize: (size: string | null) => void;
  reservedStockBySku: Record<string, number>;
}

const StockDetailCard = ({
  groupedStockDetails,
  selectedColorId,
  setSelectedColorId,
  selectedSize,
  setSelectedSize,
  reservedStockBySku,
}: StockDetailCardProps) => {
  const colorsArray = Object.entries(groupedStockDetails).map(([id, data]) => ({
    id: Number(id),
    colorName: data.colorName,
    sizes: data.sizes,
  }));

  const currentSelectedColor =
    selectedColorId !== null ? groupedStockDetails[selectedColorId] : null;

  const availableSizes = currentSelectedColor
    ? Object.keys(currentSelectedColor.sizes).sort((a, b) => Number(a) - Number(b))
    : [];

  return (
    <div className="space-y-3 rounded-lg bg-[#FFFCFD] p-2.5">
      <div>
        <h3 className="mb-1.5 text-[11px] font-semibold text-[#6B555A]">Color</h3>
        <div className="flex flex-wrap gap-1.5">
          {colorsArray.map((colorData) => (
            <button
              key={colorData.id}
              type="button"
              onClick={() => {
                setSelectedColorId(colorData.id);
                const firstAvailableSize = Object.entries(colorData.sizes)
                  .sort(([a], [b]) => Number(a) - Number(b))
                  .find(
                    ([, item]) =>
                      item.stock_actual - (reservedStockBySku[item.sku] ?? 0) > 0,
                  )?.[0];
                setSelectedSize(firstAvailableSize ?? null);
              }}
              className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-colors
                ${selectedColorId === colorData.id
                  ? "border-[#984258] bg-[#FFF3F7] text-[#984258]"
                  : "border-[#F0E3E6] bg-white text-[#251721] hover:bg-[#FFF9FB]"
                }`}
              aria-pressed={selectedColorId === colorData.id}
            >
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#F4E8EB] text-[8px] font-bold uppercase text-[#984258]">
                {colorData.colorName.charAt(0)}
              </span>
              {colorData.colorName}
            </button>
          ))}
        </div>
      </div>

      {selectedColorId !== null && availableSizes.length > 0 && (
        <div>
          <h3 className="mb-1.5 text-[11px] font-semibold text-[#6B555A]">Talla</h3>
          <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-5">
            {availableSizes.map((size) => {
              const variant = currentSelectedColor?.sizes[size];
              const stock = Math.max(
                0,
                (variant?.stock_actual ?? 0) -
                  (variant ? reservedStockBySku[variant.sku] ?? 0 : 0),
              );
              const isSelected = selectedSize === size;
              const isDisabled = stock <= 0;
              const status = getStockStatus(stock);
              const statusConfig = STOCK_STATUS_CONFIG[status];
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  disabled={isDisabled}
                  className={`flex min-h-12 flex-col items-center justify-center rounded-md border px-2 py-1 text-[10px] transition-colors
                    ${statusConfig.badgeClass}
                    ${isSelected ? "ring-2 ring-[#984258] ring-offset-1" : ""}
                    ${isDisabled ? "cursor-not-allowed opacity-45 grayscale" : ""}`}
                  title={statusConfig.label}
                  aria-disabled={isDisabled}
                >
                  <span className="font-semibold">T.{size}</span>
                  <span className="mt-0.5 text-[9px] text-current/70">
                    {stock === 0
                      ? "Agotado"
                      : `${stock} · ${statusConfig.label}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2.5 border-t border-[#F0E3E6] pt-1.5 text-[9px] text-[#867275]">
        {(["available", "low", "critical"] as const).map((status) => (
          <span key={status} className="flex items-center gap-1">
            <span
              className={`h-2 w-2 rounded-full ${STOCK_STATUS_CONFIG[status].dotClass}`}
            />
            {STOCK_STATUS_CONFIG[status].label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default StockDetailCard;
