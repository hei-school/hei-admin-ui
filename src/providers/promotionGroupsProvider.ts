import {HaDataProviderType} from "./HaDataProviderType";
import {groupsApi, promotionApi} from "./api";

const promotionGroupsProvider: HaDataProviderType = {
  getList: async (
    _page: number,
    _perPage: number,
    _filter,
    meta: {promotionId: string}
  ) => {
    return promotionApi()
      .getPromotionById(meta.promotionId)
      .then((result) => ({data: result.data.groups ?? []}));
  },
  getOne: async (groupId: string) => {
    return groupsApi()
      .getGroupById(groupId)
      .then((response) => response.data);
  },
  saveOrUpdate: () => {
    throw new Error("Not implemented");
  },
  delete: () => {
    throw new Error("Not implemented");
  },
};

export default promotionGroupsProvider;
