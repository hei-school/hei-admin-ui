import {PaymentTypeEnum} from "@haapi-b0fc7615/typescript-client";

export const currentYear = new Date().getFullYear();

export const contactEmail = "contact@hei.school";

export const paymentTypes = [
  {name: "Virement Bancaire", id: PaymentTypeEnum.BANK_TRANSFER},
  {name: "Mobile money", id: PaymentTypeEnum.MOBILE_MONEY},
  {name: "Cash", id: PaymentTypeEnum.CASH},
  {name: "Crédit", id: PaymentTypeEnum.CREDIT},
];
