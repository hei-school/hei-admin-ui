import {paymentTypes} from "../../conf";

export const paymentTypeRenderer = (type) => {
  return paymentTypes.find((element) => element.id.toString() === type);
};

if (typeof window !== "undefined") {
  // @ts-ignore
  window.paymentTypeRenderer = paymentTypeRenderer;
}
