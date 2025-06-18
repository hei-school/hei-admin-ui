import {promotionApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const exportPromotionProvider: HaDataProviderType = {
  getList() {
    throw new Error("Not implemented");
  },

  async getOne(id: string) {
    return promotionApi()
      .getStudentsByPromotion(id, {responseType: "arraybuffer"})
      .then((res) => ({id, file: res.data}));
  },

  saveOrUpdate() {
    throw new Error("Not implemented");
  },

  delete() {
    throw new Error("Not implemented");
  },
};

export default exportPromotionProvider;
