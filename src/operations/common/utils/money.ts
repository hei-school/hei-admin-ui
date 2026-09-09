import {EMPTY_TEXT} from "@/ui/constants";

const CURRENCY = "Ar";

export const renderMoney = (amount: number): string => {
  if (amount == null) return EMPTY_TEXT;
  return `${amount.toLocaleString("fr-FR")} ${CURRENCY}`;
};

if (typeof window !== "undefined") {
  // @ts-ignore
  window.renderMoney = renderMoney;
}
