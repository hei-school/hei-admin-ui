import { HaDataProviderType } from "./HaDataProviderType";

const commentProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    return [

    ]
  },
  async getOne(id: string) {
    throw new Error("Not implemented");
  },
  async saveOrUpdate(payload: any) {
    return payload;
  },
  async delete(id: string) {
    throw new Error("Not implemented");
  },
};

export default commentProvider;
