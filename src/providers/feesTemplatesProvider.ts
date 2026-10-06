import {
  CrupdateFeeTemplate,
  FeeTemplate,
} from "@haapi-b0fc7615/typescript-client";
import {payingApi} from "./api";
import {HaDataProviderType, HaMeta, notImplemented} from "./HaDataProviderType";

interface FeeTemplateFilter {
  name?: string;
  amount?: number;
  numberOfPayments?: number;
}

type FeeTemplatePayload = CrupdateFeeTemplate & {id: string};

const feesTemplatesProvider: HaDataProviderType<
  FeeTemplate,
  FeeTemplateFilter,
  HaMeta,
  FeeTemplatePayload[]
> = {
  async getList(page: number, perPage: number, filter: FeeTemplateFilter) {
    return payingApi()
      .getFeeTemplates(
        filter.name,
        filter.amount,
        filter.numberOfPayments,
        page,
        perPage
      )
      .then((result) => ({data: result.data}));
  },
  async getOne(id: string) {
    return payingApi()
      .getFeeTemplateById(id)
      .then((response) => response.data);
  },
  async saveOrUpdate(payloads) {
    const payload = payloads[0];
    return payingApi()
      .crupdateFeeTemplate(payload.id, payload)
      .then((response) => [response.data]);
  },
  delete: notImplemented,
};

export default feesTemplatesProvider;
