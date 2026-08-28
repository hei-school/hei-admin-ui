import {PaymentStatus} from "@haapi-3d601c85/typescript-client";
import {payingApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const ALL_STATUSES = [
  PaymentStatus.CREATED,
  PaymentStatus.VALIDATE,
  PaymentStatus.INVALIDATE,
];
const MAX_CREDIT_PAYMENTS_PER_STATUS = 500;

const byMostRecent = (
  a: {creation_datetime?: Date},
  b: {creation_datetime?: Date}
) =>
  new Date(b.creation_datetime ?? 0).getTime() -
  new Date(a.creation_datetime ?? 0).getTime();

const creditPaymentProvider: HaDataProviderType = {
  getList: async (
    page: number,
    perPage: number,
    filter: {status?: PaymentStatus} = {}
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
