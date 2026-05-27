import {ResultOverviewStatus} from "@haapi-b0fc7615/typescript-client";
import {usersApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const studentsResultOverviewProvider: HaDataProviderType = {
  getList: async (
    _page: number,
    _perPage: number,
    filter: {status: ResultOverviewStatus; promotionId: string}
  ) => {
    const {promotionId, status} = filter;
    return usersApi()
      .getStudentsResultOverviewsByStatus(promotionId, status)
      .then((response) => ({data: response.data}));
  },
  getOne: () => {
    throw new Error("  not implemented.");
  },
  saveOrUpdate: () => {
    throw new Error("  not implemented.");
  },
  delete: () => {
    throw new Error("  not implemented.");
  },
};

export default studentsResultOverviewProvider;
