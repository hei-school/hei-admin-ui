import {CrupdatePromotion} from "@haapi/typescript-client";
import {HaDataProviderType} from "./HaDataProviderType";
import {promotionApi} from "./api";

const promotionProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    return promotionApi()
      .getPromotions(page, perPage, filter.name, filter.ref, filter.groupRef)
      .then((result) => ({data: result.data}));
  },
  async getOne(id: string) {
    return promotionApi()
      .getPromotionById(id)
      .then((response) => response.data);
  },
  async saveOrUpdate(payload: CrupdatePromotion[]) {
    if (payload.length <= 0) {
      throw new Error("Cannot create empty list of promotions");
    }
    return promotionApi()
      .crupdatePromotion(payload[0])
      .then((response) => [response.data]);
  },
  async delete(_id: string) {
    throw new Error("Not implemented");
  },
};

export default promotionProvider;
