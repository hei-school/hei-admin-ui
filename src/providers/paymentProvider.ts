import {MobileMoneyType, Payment} from "@haapi-b0fc7615/typescript-client";
import {v4 as uuid} from "uuid";
import {payingApi} from "./api";
import {toApiIds as toApiFeeIds} from "./feeProvider";
import {HaDataProviderType} from "./HaDataProviderType";

const RA_SEPARATOR = "--";

type PaymentResource = Payment & {
  feeId: string;
  psp_id?: string;
  psp_type?: MobileMoneyType;
};

const toRaId = (studentId: string, feeId: string, paymentId: string): string =>
  `${studentId}${RA_SEPARATOR}${feeId}${RA_SEPARATOR}${paymentId}`;

const toApiPaymentId = (raId: string) => {
  const [studentId, feeId, paymentId] = raId.split(RA_SEPARATOR);

  return {
    studentId,
    feeId,
    paymentId,
  };
};

const paymentProvider: HaDataProviderType = {
  getList: async (page: number, perPage: number, filter: {feeId: string}) => {
    const {studentId, feeId} = toApiFeeIds(filter.feeId);

    return payingApi()
      .getStudentPayments(studentId, feeId, page, perPage)
      .then((result) => ({
        data: result.data.map((payment: Payment) => ({
          ...payment,
          id: toRaId(studentId, feeId, payment.id as string),
        })),
      }));
  },
  getOne: () => {
    throw new Error("Function not implemented.");
  },
  saveOrUpdate: async (resources: PaymentResource[]) => {
    if (!resources.length) {
      return Promise.reject(new Error("No payments provided"));
    }
    const raFeeId = resources[0].feeId;
    const {studentId, feeId} = toApiFeeIds(raFeeId);
    resources.forEach((payment) => {
      if (payment.feeId !== raFeeId) {
        throw new Error("Creation of payments for multiple fees not supported");
      }
    });
    const firstPayment = resources[0];
    const createPayments = () =>
      payingApi()
        .createStudentPayments(studentId, feeId, resources)
        .then((result) => ({
          ...result.data,
        }));
    if (firstPayment.psp_id) {
      return payingApi()
        .crupdateMpbs(studentId, feeId, {
          id: uuid(),
          student_id: studentId,
          fee_id: feeId,
          psp_id: firstPayment.psp_id,
          psp_type: firstPayment.psp_type,
        })
        .then(() => createPayments());
    }

    return createPayments();
  },
  delete: async (id: string) => {
    const {studentId, feeId, paymentId} = toApiPaymentId(id);
    return payingApi()
      .deleteStudentFeePaymentById(studentId, feeId, paymentId)
      .then((response) => response.data);
  },
};

export default paymentProvider;
