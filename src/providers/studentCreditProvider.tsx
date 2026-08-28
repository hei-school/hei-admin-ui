import {CreditMovement} from "@haapi-3d601c85/typescript-client";
import {HaDataProviderType} from "./HaDataProviderType";
import {payingApi} from "./api";

const studentCreditProvider: HaDataProviderType = {
  getList: async (page, perPage, filter) => {
    const studentId = filter.studentId as string;
    return payingApi()
      .getCreditTransactionsByStudentId(
        studentId,
        filter.movement as CreditMovement,
        page,
        perPage
      )
      .then((response) => ({
        data: response.data.map((transaction) => ({
          ...transaction,
          id: transaction.transaction_id,
        })),
      }));
  },
  getOne: async (studentId) => {
    return payingApi()
      .getCreditByStudentId(studentId)
      .then((response) => response.data);
  },
  saveOrUpdate: () => {
    throw new Error("Function not implemented.");
  },
  delete: () => {
    throw new Error("Function not implemented.");
  },
};

export default studentCreditProvider;
