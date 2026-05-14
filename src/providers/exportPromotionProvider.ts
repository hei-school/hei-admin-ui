import {promotionApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const exportPromotionProvider: HaDataProviderType = {
  getList: () => {
    throw new Error("Function not implemented.");
  },

  getOne: async (id: string) => {
    return promotionApi()
      .getStudentsByPromotion(id, {responseType: "arraybuffer"})
      .then((res) => ({id, file: res.data}));
  },

  saveOrUpdate: () => {
    throw new Error("Function not implemented.");
  },

  delete: () => {
    throw new Error("Function not implemented.");
  },
};

export default exportPromotionProvider;
