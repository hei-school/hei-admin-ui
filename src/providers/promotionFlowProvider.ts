import {
  Promotion,
  UpdatePromotionSGroup,
} from "@haapi-b0fc7615/typescript-client";
import {HaDataProviderType, HaFilter, HaMeta} from "./HaDataProviderType";
import {promotionApi} from "./api";

type PromotionFlowParams = {
  promotionId: string;
};

const promotionFlowsProvider: HaDataProviderType<
  Promotion,
  HaFilter,
  HaMeta,
  UpdatePromotionSGroup[],
  PromotionFlowParams
> = {
  getList: () => {
    throw new Error("Not implemented");
  },
  getOne: () => {
    throw new Error("Not implemented");
  },
  saveOrUpdate: async (
    payload: UpdatePromotionSGroup[],
    meta: PromotionFlowParams
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
