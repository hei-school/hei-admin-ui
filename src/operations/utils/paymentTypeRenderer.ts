import {paymentTypes} from "../../conf";

export const paymentTypeRenderer = (type?: string) => {
  return paymentTypes.find((element) => element.id.toString() === type);
};

declare global {
  interface Window {
    paymentTypeRenderer?: typeof paymentTypeRenderer;
  }
}

if (typeof window !== "undefined") {
  window.paymentTypeRenderer = paymentTypeRenderer;
}
