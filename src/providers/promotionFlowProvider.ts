import {UpdatePromotionSGroup} from "@haapi/typescript-client";
import {HaDataProviderType} from "./HaDataProviderType";
import {promotionApi} from "./api";

const promotionFlowsProvider: HaDataProviderType = {
  async getList(_page: number, _perPage: number, _filter: any, _meta: any) {
    throw new Error("Not implemented");
  },
  async getOne(_groupId: string) {
    throw new Error("Not implemented");
  },
  async saveOrUpdate(
    payload: UpdatePromotionSGroup[],
    meta: {promotionId: string}
  ) {
    if (payload.length <= 0) {
      throw new Error("Cannot update empty list of promotions");
    }
    return promotionApi()
      .updatePromotionGroups(meta.promotionId, payload[0])
      .then((response) => [response.data]);
  },
  async delete(_id: string) {
    throw new Error("Not implemented");
  },
};

export default promotionFlowsProvider;
