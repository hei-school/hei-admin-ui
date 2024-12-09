import {HaDataProviderType} from "./HaDataProviderType";
import {payingApi, usersApi} from "./api";
import {MAX_ITEM_PER_PAGE} from "./dataProvider";

const statsProvider: HaDataProviderType = {
  async getList(_page: number, _perPage: number, _filter: any) {
    throw new Error("Function not implemented.");
  },
  async getOne(id: string, meta = {}) {
    const filter = meta.filters ?? {};
    switch (meta.resource) {
      case "users":
        return usersApi()
          .getStats()
          .then((result) => ({id, ...result.data}));
      case "fees":
        return payingApi()
          .getFees(
            filter.transaction_status,
            filter.type,
            filter.status,
            filter.monthFrom,
            filter.monthTo,
            1,
            MAX_ITEM_PER_PAGE,
            filter.isMpbs,
            filter.student_ref
          )
          .then(({data: {statistics}}) => ({id, ...statistics}));
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
