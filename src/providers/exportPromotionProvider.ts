import {promotionApi} from "./api";
import {HaDataProviderType, notImplemented} from "./HaDataProviderType";
import {ExportedFile} from "./types";

const exportPromotionProvider: HaDataProviderType<ExportedFile> = {
  getList: notImplemented,

  getOne: async (id: string) => {
    return promotionApi()
      .getStudentsByPromotion(id, {responseType: "arraybuffer"})
      .then((res) => ({id, file: res.data}));
  },

  saveOrUpdate: notImplemented,

  delete: notImplemented,
};

export default exportPromotionProvider;
