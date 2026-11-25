import {StudentLevel} from "@haapi-3d601c85/typescript-client";
import {promotionApi} from "./api";
import {HaDataProviderType, notImplemented} from "./HaDataProviderType";
import {ExportedFile} from "./types";

interface ExportYearlyResultsRankingMeta {
  level?: StudentLevel;
}

const exportYearlyResultsRankingProvider: HaDataProviderType<
  ExportedFile,
  unknown,
  ExportYearlyResultsRankingMeta
> = {
  getList: notImplemented,

  getOne: async (id: string, meta: ExportYearlyResultsRankingMeta = {}) => {
    return promotionApi()
      .generateYearlyResultsRankingXlsx(id, meta.level!, {
        responseType: "arraybuffer",
      })
      .then((res) => ({id, file: res.data}));
  },

  saveOrUpdate: notImplemented,

  delete: notImplemented,
};

export default exportYearlyResultsRankingProvider;
