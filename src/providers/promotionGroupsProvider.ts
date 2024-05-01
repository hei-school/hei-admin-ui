import {CrupdatePromotion, Group} from "@haapi/typescript-client";
import {HaDataProviderType} from "./HaDataProviderType";
import {promotionApi, teachingApi} from "./api";

const promotionGroupsProvider: HaDataProviderType = {
  async getList(_page: number, _perPage: number, _filter: any, meta: any) {
    return promotionApi()
      .getPromotionById(meta.promotionId)
      .then((response) => {
        const promotion = response.data;
        return promotion.groups as Group[];
      });
  },
  async getOne(groupId: string) {
    throw new Error("Not implemented");
  },
  async saveOrUpdate(_payload: CrupdatePromotion[]) {
    throw new Error("Not implemented");
  },
  async delete(_id: string) {
    throw new Error("Not implemented");
  },
};

export default promotionGroupsProvider;
