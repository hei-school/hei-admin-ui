import {UpdatePromotionSGroup} from "@haapi-b0fc7615/typescript-client";
import {HaDataProviderType} from "./HaDataProviderType";
import {promotionApi} from "./api";

const promotionFlowsProvider: HaDataProviderType = {
  getList: () => {
    throw new Error("Not implemented");
  },
  getOne: () => {
    throw new Error("Not implemented");
  },
  saveOrUpdate: async (
    payload: UpdatePromotionSGroup[],
    meta: {promotionId: string}
  ) => {
    if (payload.length <= 0) {
      throw new Error("Cannot update empty list of promotions");
    }
    return promotionApi()
      .updatePromotionGroups(meta.promotionId, payload[0])
      .then((response) => [response.data]);
  },
  delete: () => {
    throw new Error("Not implemented");
  },
};

export default promotionFlowsProvider;
