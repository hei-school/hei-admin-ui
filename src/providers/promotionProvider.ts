import {CrupdatePromotion, Promotion} from "@haapi-b0fc7615/typescript-client";
import {HaDataProviderType, HaMeta, notImplemented} from "./HaDataProviderType";
import {promotionApi} from "./api";

interface PromotionFilter {
  ref?: string;
  name?: string;
  groupRef?: string;
}

const promotionProvider: HaDataProviderType<
  Promotion,
  PromotionFilter,
  HaMeta,
  CrupdatePromotion[]
> = {
  getList: async (page: number, perPage: number, filter: PromotionFilter) => {
    return promotionApi()
      .getPromotions(page, perPage, filter.name, filter.ref, filter.groupRef)
      .then((result) => ({data: result.data}));
  },
  getOne: async (id: string) => {
    return promotionApi()
      .getPromotionById(id)
      .then((response) => response.data);
  },
  saveOrUpdate: async (payload: CrupdatePromotion[]) => {
    if (payload.length <= 0) {
      throw new Error("Cannot create empty list of promotions");
    }
    return promotionApi()
      .crupdatePromotion(payload[0])
      .then((response) => [response.data]);
  },
  delete: notImplemented,
};

export default promotionProvider;
