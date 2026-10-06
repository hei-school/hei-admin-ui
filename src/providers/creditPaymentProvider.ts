import {CreditPayment, PaymentStatus} from "@haapi-b0fc7615/typescript-client";
import {payingApi} from "./api";
import {HaDataProviderType, notImplemented} from "./HaDataProviderType";

const ALL_STATUSES = [
  PaymentStatus.CREATED,
  PaymentStatus.VALIDATE,
  PaymentStatus.INVALIDATE,
];
const MAX_CREDIT_PAYMENTS_PER_STATUS = 500;

interface CreditPaymentFilter {
  status?: PaymentStatus;
}

const byMostRecent = (
  a: {creation_datetime?: Date},
  b: {creation_datetime?: Date}
) =>
  new Date(b.creation_datetime ?? 0).getTime() -
  new Date(a.creation_datetime ?? 0).getTime();

const creditPaymentProvider: HaDataProviderType<
  CreditPayment,
  CreditPaymentFilter
> = {
  getList: async (
    page: number,
    perPage: number,
    filter: CreditPaymentFilter = {}
  ) => {
    if (filter.status) {
      return payingApi()
        .getCreditPaymentsByStatus(filter.status, page, perPage)
        .then((response) => ({data: response.data}));
    }
    const responses = await Promise.all(
      ALL_STATUSES.map((status) =>
        payingApi().getCreditPaymentsByStatus(
          status,
          1,
          MAX_CREDIT_PAYMENTS_PER_STATUS
        )
      )
    );
    const data = responses
      .flatMap((response) => response.data)
      .sort(byMostRecent)
      .slice((page - 1) * perPage, page * perPage);
    return {data};
  },
  getOne: notImplemented,
  saveOrUpdate: notImplemented,
  delete: notImplemented,
};

export default creditPaymentProvider;
