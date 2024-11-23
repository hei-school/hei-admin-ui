import {promotionApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const exportPromotionProvider: HaDataProviderType = {
  async getList() {
    throw new Error("Function not implemented.");
  },

  async getOne(id: string) {
    return promotionApi()
      .getStudentsByPromotion(id, {responseType: "arraybuffer"})
      .then((res) => ({id, file: res.data}));
  },

  async saveOrUpdate() {
    throw new Error("Function not implemented.");
  },

  async delete() {
    throw new Error("Function not implemented.");
  },
};

export default exportPromotionProvider;
