import {CrupdatePromotion} from "@haapi-b0fc7615/typescript-client";
import {HaDataProviderType} from "./HaDataProviderType";
import {promotionApi} from "./api";

const promotionProvider: HaDataProviderType = {
  getList: async (
    page: number,
    perPage: number,
    filter: {ref?: string; name?: string; groupRef?: string}
  ) => {
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
  delete: () => {
    throw new Error("Not implemented");
  },
};

export default promotionProvider;
