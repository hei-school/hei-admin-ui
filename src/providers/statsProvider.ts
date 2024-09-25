import {HaDataProviderType} from "./HaDataProviderType";
import {usersApi} from "./api";

const statsProvider: HaDataProviderType = {
  async getList(_page: number, _perPage: number, _filter: any) {
    throw new Error("Function not implemented.");
  },
  async getOne(id: string) {
    return usersApi()
      .getStats()
      .then((result) => ({id, ...result.data}));
  },
  async saveOrUpdate(_payload: any) {
    throw new Error("Function not implemented.");
  },
  async delete(_id: string) {
    throw new Error("Not implemented");
  },
};

export default statsProvider;
