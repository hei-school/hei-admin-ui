import {CreditMovement, PaymentStatus} from "@haapi-b0fc7615/typescript-client";
import {HaDataProviderType} from "./HaDataProviderType";
import {payingApi} from "./api";

const FETCH_ALL_PAGE_SIZE = 500;

const getPendingCreditAmount = async (studentId: string): Promise<number> => {
  const [studentFees, pendingCreditPayments] = await Promise.all([
    payingApi().getFeesByStudentId(studentId, 1, FETCH_ALL_PAGE_SIZE),
    payingApi().getCreditPaymentsByStatus(
      PaymentStatus.CREATED,
      1,
      FETCH_ALL_PAGE_SIZE
    ),
  ]);

  const studentFeeIds = new Set(studentFees.data.map((fee) => fee.id));

  return pendingCreditPayments.data
    .filter((payment) => studentFeeIds.has(payment.fee_id))
    .reduce((total, payment) => total + (payment.amount ?? 0), 0);
};

const studentCreditProvider: HaDataProviderType = {
  getList: async (page, perPage, filter) => {
    const studentId = filter.studentId as string;

    const result = await payingApi().getCreditTransactionsByStudentId(
      studentId,
      filter as CreditMovement,
      page,
      perPage
    );

    return {
      data: result.data.map((transaction) => ({
        id: transaction.transaction_id,
        transaction_id: transaction.transaction_id,
        movement: transaction.movement,
        amount: transaction.amount,
        date_time: transaction.date_time,
        fee: transaction.fee,
        credit: transaction.credit,
      })),
    };
  },
  getOne: async (studentId) => {
    const [creditResult, pendingCreditAmount] = await Promise.all([
      payingApi().getCreditByStudentId(studentId),
      getPendingCreditAmount(studentId),
    ]);

    const credit = creditResult.data;

    return {
      ...credit,
      amount: (credit.amount ?? 0) - pendingCreditAmount,
    };
  },
  saveOrUpdate: () => {
    throw new Error("Function not implemented.");
  },

  delete: () => {
    throw new Error("Function not implemented.");
  },
};

export default studentCreditProvider;
