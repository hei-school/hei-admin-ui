import {CreditTransactionType} from "@haapi-b0fc7615/typescript-client";

export const CREDIT_TRANSACTION_TYPE_LABEL: Record<
  CreditTransactionType,
  string
> = {
  [CreditTransactionType.FEE_OVERPAYMENT]: "Trop-perçu sur un frais",
  [CreditTransactionType.FEE_ARCHIVING]: "Archivage de frais",
  [CreditTransactionType.CREDIT_PAYMENT]: "Paiement par crédit",
};

export const CREDIT_TRANSACTION_TYPE_COLOR: Record<
  CreditTransactionType,
  "info" | "secondary" | "default"
> = {
  [CreditTransactionType.FEE_OVERPAYMENT]: "info",
  [CreditTransactionType.FEE_ARCHIVING]: "secondary",
  [CreditTransactionType.CREDIT_PAYMENT]: "default",
};
