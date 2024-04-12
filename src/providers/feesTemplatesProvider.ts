import { payingApi } from "./api";
import { HaDataProviderType } from "./HaDataProviderType";

const feesTemplatesProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    return payingApi()
      .getFeeTemplates(
        filter.name,
        filter.amount,
        filter.numberOfPayments,
        page,
        perPage,
      )
      .then((response) => response.data);
  },
  async getOne(id: string) {
    return payingApi()
      .getFeeTemplateById(id)
      .then((response) => response.data);
  },
  async saveOrUpdate(payload: any) {
    return payingApi()
      .crupdateFeeTemplate(payload, payload[0])
      .then((response) => [response.data]);
  },
  async delete(id: string) {
    throw new Error("Not implemented");
  },
};

export default feesTemplatesProvider;
