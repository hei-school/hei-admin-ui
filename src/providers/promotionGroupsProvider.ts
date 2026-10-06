import {Group} from "@haapi-b0fc7615/typescript-client";
import {HaDataProviderType, HaFilter} from "./HaDataProviderType";
import {groupsApi, promotionApi} from "./api";

interface PromotionGroupsMeta {
  promotionId: string;
}

const promotionGroupsProvider: HaDataProviderType<
  Group,
  HaFilter,
  PromotionGroupsMeta
> = {
  getList: async (
    _page: number,
    _perPage: number,
    _filter,
    meta: PromotionGroupsMeta
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
