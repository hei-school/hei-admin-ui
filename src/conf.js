import {PaymentTypeEnum} from "@haapi/typescript-client";

export const currentYear = new Date().getFullYear();

export const contactEmail = "contact@hei.school";

export const paymentTypes = [
  {name: "Virement Bancaire", id: PaymentTypeEnum.BANK_TRANSFER},
  {name: "Mobile money", id: PaymentTypeEnum.MOBILE_MONEY},
  {name: "Cash", id: PaymentTypeEnum.CASH},
];
