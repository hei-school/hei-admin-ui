import {MobileMoneyType, Payment} from "@haapi-3d601c85/typescript-client";
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
  return {studentId, feeId, paymentId};
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
  saveOrUpdate: async (resources: PaymentResource[][]) => {
    const payments: PaymentResource[] = resources[0];
    if (!payments?.length) {
      return Promise.reject(new Error("No payments provided"));
    }
    const raFeeId = payments[0].feeId;
    const {studentId, feeId} = toApiFeeIds(raFeeId);
    payments.forEach((payment) => {
      if (payment.feeId !== raFeeId) {
        throw new Error("Creation of payments for multiple fees not supported");
      }
    });
    if (payments[0].psp_id) {
      await payingApi().crupdateMpbs(studentId, feeId, {
        id: uuid(),
        student_id: studentId,
        fee_id: feeId,
        psp_id: payments[0].psp_id,
        psp_type: payments[0].psp_type,
      });
    }
    const result = await payingApi().createStudentPayments(
      studentId,
      feeId,
      payments
    );
    return {...result.data};
  },
  delete: async (id: string) => {
    const {studentId, feeId, paymentId} = toApiPaymentId(id);
    return payingApi()
      .deleteStudentFeePaymentById(studentId, feeId, paymentId)
      .then((response) => response.data);
  },
};

export default paymentProvider;
