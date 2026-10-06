import {EMPTY_TEXT} from "@/ui/constants";

const CURRENCY = "Ar";

export const renderMoney = (amount: number | null | undefined): string => {
  if (amount == null) return EMPTY_TEXT;
  return `${amount.toLocaleString("fr-FR")} ${CURRENCY}`;
};

declare global {
  interface Window {
    renderMoney?: typeof renderMoney;
  }
}

if (typeof window !== "undefined") {
  window.renderMoney = renderMoney;
}
