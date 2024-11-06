import {HaDataProviderType} from "./HaDataProviderType";
import {payingApi, usersApi} from "./api";

const statsProvider: HaDataProviderType = {
  async getList(_page: number, _perPage: number, _filter: any) {
    throw new Error("Function not implemented.");
  },
  async getOne(id: string, meta) {
    switch (meta.resource) {
      case "users":
        return usersApi()
          .getStats()
          .then((result) => ({id, ...result.data}));
      case "fees":
        return payingApi()
          .getFeesStats()
          .then((result) => ({id, ...result.data}));
      default:
        console.error("unknown resource type for getStats");
        return;
    }
  },
  async saveOrUpdate(_payload: any) {
    throw new Error("Function not implemented.");
  },
  async delete(_id: string) {
    throw new Error("Not implemented");
  },
};

export default statsProvider;
