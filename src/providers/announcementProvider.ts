import {HaDataProviderType} from "./HaDataProviderType";

const annoucementrovider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    throw new Error("Function not implemented.");
  },
  async getOne(id: string) {
    throw new Error("Function not implemented.");
  },
  async saveOrUpdate(payload: any) {
    throw new Error("Function not implemented.");
  },
  async delete(id: string) {
    throw new Error("Not implemented");
  },
};

export default annoucementrovider;