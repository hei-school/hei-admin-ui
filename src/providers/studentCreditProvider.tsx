import {
  CreditMovement,
  PaymentStatus,
  PaymentTypeEnum,
} from "@haapi-b0fc7615/typescript-client";
import {HaDataProviderType} from "./HaDataProviderType";
import {payingApi} from "./api";

const FETCH_ALL_PAGE_SIZE = 500;

// Computed from the student's own fees/payments (instead of the
// manager/admin-only "all credit payments" endpoint) so it can be used both
// from a manager's view of a student and from the student's own view.
const getPendingCreditAmount = async (studentId: string): Promise<number> => {
  const {data: studentFees} = await payingApi().getFeesByStudentId(
    studentId,
    1,
    FETCH_ALL_PAGE_SIZE
  );

  const paymentsByFee = await Promise.all(
    studentFees.map((fee) =>
      payingApi().getStudentPayments(
        studentId,
        fee.id as string,
        1,
        FETCH_ALL_PAGE_SIZE
      )
    )
  );

  return paymentsByFee
    .flatMap((result) => result.data)
    .filter(
      (payment) =>
        payment.type === PaymentTypeEnum.CREDIT &&
        payment.status === PaymentStatus.CREATED
    )
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
