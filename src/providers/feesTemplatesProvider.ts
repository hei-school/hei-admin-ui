import {payingApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const feesTemplatesProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
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
  async saveOrUpdate(payloads: any) {
    const payload = payloads[0];
    return payingApi()
      .crupdateFeeTemplate(payload.id, payload)
      .then((response) => [response.data]);
  },
  async delete(_id: string) {
    throw new Error("Not implemented");
  },
};

export default feesTemplatesProvider;
