import {EMPTY_TEXT} from "@/ui/constants";

const CURRENCY = "Ar";

export const renderMoney = (amount?: number): string => {
  return `${amount ?? EMPTY_TEXT} ${CURRENCY}`;
};

if (typeof window !== "undefined") {
  // @ts-expect-error window.renderMoney is not typed
  window.renderMoney = renderMoney;
}
