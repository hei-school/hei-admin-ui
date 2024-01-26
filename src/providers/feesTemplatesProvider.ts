import { payingApi } from "./api";
import { HaDataProviderType } from "./HaDataProviderType";

const feetypesProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    return payingApi()
      .getFeeTemplates(filter.name, filter.amount, filter.numberOfPayments, page, perPage)
      .then(response => response.data);
  },
  async getOne(id: string) {
    return payingApi()
      .getFeeTemplateById(id)
      .then(response => response.data)
  },
  async saveOrUpdate(payload: any) {
    return payingApi()
      .crupdateFeeTemplate(payload.id , payload)
      .then(response => response.data)
  },
};

export default feetypesProvider;
