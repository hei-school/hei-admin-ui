import {Promotion, StudentLevel} from "@haapi-b0fc7615/typescript-client";
import {
  HaDataProviderType,
  HaFilter,
  notImplemented,
} from "./HaDataProviderType";
import {promotionApi} from "./api";

interface TemplatePromotionsMeta {
  level?: StudentLevel;
}

const templatePromotionsProvider: HaDataProviderType<
  Promotion,
  HaFilter,
  TemplatePromotionsMeta
> = {
  getList: async (
    page: number,
    perPage: number,
    _filter: unknown,
    meta: TemplatePromotionsMeta
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
