import {
  Payment,
  PaymentStatus,
  PaymentTypeEnum,
} from "@haapi-b0fc7615/typescript-client";
import {fee1Mock} from "./fees-mocks";

export const creditPaymentPendingMock: Payment = {
  id: "credit_payment_pending_id",
  fee_id: fee1Mock.id,
  creation_datetime: new Date("2024-01-10T08:00:00Z"),
  type: PaymentTypeEnum.CREDIT,
  status: PaymentStatus.CREATED,
  amount: 50000,
  comment: "Paiement par crédit en attente",
};

export const creditPaymentValidatedMock: Payment = {
  id: "credit_payment_validated_id",
  fee_id: fee1Mock.id,
  creation_datetime: new Date("2024-01-05T08:00:00Z"),
  type: PaymentTypeEnum.CREDIT,
  status: PaymentStatus.VALIDATE,
  amount: 80000,
  comment: "Paiement par crédit validé",
};

export const creditPaymentRejectedMock: Payment = {
  id: "credit_payment_rejected_id",
  fee_id: fee1Mock.id,
  creation_datetime: new Date("2024-01-01T08:00:00Z"),
  type: PaymentTypeEnum.CREDIT,
  status: PaymentStatus.INVALIDATE,
  amount: 30000,
  comment: "Paiement par crédit rejeté",
};

export const creditPaymentsByStatusMock: Record<PaymentStatus, Payment[]> = {
  [PaymentStatus.CREATED]: [creditPaymentPendingMock],
  [PaymentStatus.VALIDATE]: [creditPaymentValidatedMock],
  [PaymentStatus.INVALIDATE]: [creditPaymentRejectedMock],
};

export const studentCreditMock = {
  id: "credit1_id",
  amount: 500000,
};
