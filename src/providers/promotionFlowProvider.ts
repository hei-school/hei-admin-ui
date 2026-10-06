import {
  Promotion,
  UpdatePromotionSGroup,
} from "@haapi-b0fc7615/typescript-client";
import {
  HaDataProviderType,
  HaFilter,
  HaMeta,
  notImplemented,
} from "./HaDataProviderType";
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
  getList: notImplemented,
  getOne: notImplemented,
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
  delete: notImplemented,
};

export default promotionFlowsProvider;
