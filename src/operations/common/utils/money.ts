import {EMPTY_TEXT} from "@/ui/constants";

const CURRENCY = "Ar";

export const renderMoney = (amount: number): string => {
  return `${amount ?? EMPTY_TEXT} ${CURRENCY}`;
};

if (typeof window !== "undefined") {
  // @ts-ignore
  window.renderMoney = renderMoney;
}
