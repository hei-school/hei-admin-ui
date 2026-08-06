import {CreditMovement} from "@haapi-b0fc7615/typescript-client";
import {HaDataProviderType} from "./HaDataProviderType";
import {payingApi} from "./api";

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
    return await payingApi()
      .getCreditByStudentId(studentId)
      .then((result) => result.data);
  },
  saveOrUpdate: () => {
    throw new Error("Function not implemented.");
  },

  delete: () => {
    throw new Error("Function not implemented.");
  },
};

export default studentCreditProvider;
