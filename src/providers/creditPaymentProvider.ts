import {Payment, PaymentStatus} from "@haapi-b0fc7615/typescript-client";
import {payingApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const ALL_STATUSES = Object.values(PaymentStatus);
const FETCH_ALL_PAGE_SIZE = 500;

const sortByCreationDateDesc = (payments: Payment[]): Payment[] =>
  [...payments].sort(
    (a, b) =>
      new Date(b.creation_datetime ?? 0).getTime() -
      new Date(a.creation_datetime ?? 0).getTime()
  );

const fetchAllCreditPayments = async (): Promise<Payment[]> => {
  const resultsByStatus = await Promise.all(
    ALL_STATUSES.map((status) =>
      payingApi().getCreditPaymentsByStatus(status, 1, FETCH_ALL_PAGE_SIZE)
    )
  );

  return sortByCreationDateDesc(
    resultsByStatus.flatMap((result) => result.data)
  );
};

type StudentInfo = {student_ref?: string; student_credit?: number};

const findStudentInfoByPayment = async (
  payments: Payment[]
): Promise<Map<string, StudentInfo>> => {
  const feesResult = await payingApi().getFees(
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    1,
    FETCH_ALL_PAGE_SIZE
  );
  const fees = feesResult.data.data ?? [];
  const feeById = new Map(fees.map((fee) => [fee.id, fee]));

  const studentIds = [
    ...new Set(
      payments
        .map((payment) => feeById.get(payment.fee_id!)?.student_id)
        .filter((studentId): studentId is string => !!studentId)
    ),
  ];

  const credits = await Promise.all(
    studentIds.map((studentId) => payingApi().getCreditByStudentId(studentId))
  );

  const creditByStudentId = new Map(
    studentIds.map((studentId, index) => [
      studentId,
      credits[index].data.amount,
    ])
  );

  return new Map(
    payments.map((payment) => {
      const fee = feeById.get(payment.fee_id!);
      return [
        payment.id!,
        {
          student_ref: fee?.student_ref,
          student_credit: fee?.student_id
            ? creditByStudentId.get(fee.student_id)
            : undefined,
        },
      ];
    })
  );
};

const enrichWithStudentInfo = async (
  payments: Payment[]
): Promise<(Payment & StudentInfo)[]> => {
  if (!payments.length) {
    return [];
  }

  const studentInfoByPaymentId = await findStudentInfoByPayment(payments);

  return payments.map((payment) => ({
    ...payment,
    ...studentInfoByPaymentId.get(payment.id!),
  }));
};

const creditPaymentProvider: HaDataProviderType = {
  getList: async (
    page: number,
    perPage: number,
    filter: {status?: PaymentStatus} = {}
  ) => {
    if (filter.status) {
      const result = await payingApi().getCreditPaymentsByStatus(
        filter.status,
        page,
        perPage
      );

      return {
        data: await enrichWithStudentInfo(sortByCreationDateDesc(result.data)),
      };
    }

    const allPayments = await fetchAllCreditPayments();
    const start = (page - 1) * perPage;
    const pagePayments = allPayments.slice(start, start + perPage);

    return {
      data: await enrichWithStudentInfo(pagePayments),
    };
  },
  getOne: () => {
    throw new Error("Function not implemented.");
  },
  saveOrUpdate: () => {
    throw new Error("Function not implemented.");
  },
  delete: () => {
    throw new Error("Function not implemented.");
  },
};

export default creditPaymentProvider;
