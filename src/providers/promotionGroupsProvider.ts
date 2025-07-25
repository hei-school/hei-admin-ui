import {CrupdatePromotion} from "@haapi/typescript-client";
import {HaDataProviderType} from "./HaDataProviderType";
import {groupsApi, promotionApi} from "./api";

const promotionGroupsProvider: HaDataProviderType = {
  async getList(_page: number, _perPage: number, _filter: any, meta: any) {
    return promotionApi()
      .getPromotionById(meta.promotionId)
      .then((result) => ({data: result.data.groups ?? []}));
  },
  async getOne(groupId: string) {
    return groupsApi()
      .getGroupById(groupId)
      .then((response) => response.data);
  },
  async saveOrUpdate(_payload: CrupdatePromotion[]) {
    throw new Error("Not implemented");
  },
  async delete(_id: string) {
    throw new Error("Not implemented");
  },
};

export default promotionGroupsProvider;
