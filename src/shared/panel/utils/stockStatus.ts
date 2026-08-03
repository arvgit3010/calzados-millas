export type StockStatus = "available" | "low" | "critical";

export const STOCK_STATUS_CONFIG = {
  available: {
    label: "Disponible",
    badgeClass: "border-[#86EFAC] bg-[#DCFCE7] text-[#166534]",
    dotClass: "bg-[#16A34A]",
  },
  low: {
    label: "Stock bajo",
    badgeClass: "border-[#FDE047] bg-[#FEF9C3] text-[#854D0E]",
    dotClass: "bg-[#EAB308]",
  },
  critical: {
    label: "Stock crítico",
    badgeClass: "border-[#FCA5A5] bg-[#FEE2E2] text-[#991B1B]",
    dotClass: "bg-[#EF4444]",
  },
} as const;

export function getStockStatus(quantity: number): StockStatus {
  if (quantity >= 4) return "available";
  if (quantity === 3) return "low";
  return "critical";
}
