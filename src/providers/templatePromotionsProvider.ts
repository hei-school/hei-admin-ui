import {Promotion, StudentLevel} from "@haapi-b0fc7615/typescript-client";
import {HaDataProviderType} from "./HaDataProviderType";
import {promotionApi} from "./api";

const notImplemented = () => {
  throw new Error("Not implemented");
};

const templatePromotionsProvider: HaDataProviderType = {
  getList: async (
    page: number,
    perPage: number,
    _filter: unknown,
    meta: {level?: StudentLevel}
  ) => {
    const {data} = await promotionApi().getPromotions(page, perPage);
    const level = meta?.level;
    if (!level) {
      return {data};
    }
    return {
      data: data.filter(({studentLevels}: Promotion) =>
        studentLevels?.includes(level)
      ),
    };
  },
  getOne: notImplemented,
  saveOrUpdate: notImplemented,
  delete: notImplemented,
};

export default templatePromotionsProvider;
