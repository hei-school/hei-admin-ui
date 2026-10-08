import {
  Credit,
  CreditMovement,
  CreditTransaction,
} from "@haapi-b0fc7615/typescript-client";
import {HaDataProviderType, notImplemented} from "./HaDataProviderType";
import {payingApi} from "./api";

interface StudentCreditFilter {
  studentId: string;
  movement?: CreditMovement;
}

type StudentCreditResource = (CreditTransaction & {id?: string}) | Credit;

const studentCreditProvider: HaDataProviderType<
  StudentCreditResource,
  StudentCreditFilter
> = {
  getList: async (page, perPage, filter) => {
    const studentId = filter.studentId;
    return payingApi()
      .getCreditTransactionsByStudentId(
        studentId,
        filter.movement,
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
  saveOrUpdate: notImplemented,
  delete: notImplemented,
};

export default studentCreditProvider;
