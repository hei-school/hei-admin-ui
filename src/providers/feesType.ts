import {HaDataProviderType} from "./HaDataProviderType";
import {payingApi} from "./api";

const feestypeProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    return await payingApi().getFeeTypes().then(response => response.data)
  },
  async getOne(id: string) {
    throw new Error("Not implemented")
  },
  async saveOrUpdate(payload: any) {
    return await payingApi().crupdateFeeType(payload.id, payload)
  },
};

export default feestypeProvider;
