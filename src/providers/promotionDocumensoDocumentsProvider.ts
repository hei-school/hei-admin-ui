import {
  DocumensoDocument,
  DocumensoDocumentStatus,
  GenerateDocumensoDocuments,
  StudentLevel,
} from "@haapi-b0fc7615/typescript-client";
import {HaDataProviderType} from "./HaDataProviderType";
import {documensoApi} from "./api";

type PromotionFilter = {
  level?: StudentLevel;
  status?: DocumensoDocumentStatus;
};

type PromotionMeta = {
  promotionId: string;
  templateTitle?: string;
};

const notImplemented = () => {
  throw new Error("Not implemented");
};

const promotionDocumensoDocumentsProvider: HaDataProviderType = {
  getList: async (
    page: number,
    perPage: number,
    filter: PromotionFilter,
    meta: PromotionMeta
  ) => {
    const {level, status} = filter ?? {};
    const {data} = await documensoApi().getPromotionDocumensoDocuments(
      meta.promotionId,
      level,
      status,
      page,
      perPage
    );
    if (!meta.templateTitle) {
      return {data};
    }
    return {
      data: data.filter(
        ({templateTitle}: DocumensoDocument) =>
          templateTitle === meta.templateTitle
      ),
    };
  },
  getOne: notImplemented,
  saveOrUpdate: async (
    payload: GenerateDocumensoDocuments[],
    meta: {promotionId: string}
  ) => {
    if (payload.length <= 0) {
      throw new Error("Cannot launch a generation without a template");
    }
    const {data} = await documensoApi().generateDocumensoDocumentsForPromotion(
      meta.promotionId,
      payload[0]
    );
    return [data];
  },
  delete: notImplemented,
};

export default promotionDocumensoDocumentsProvider;
