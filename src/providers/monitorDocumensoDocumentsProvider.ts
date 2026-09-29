import {HaDataProviderType} from "./HaDataProviderType";
import {documensoApi} from "./api";

const notImplemented = () => {
  throw new Error("Not implemented");
};

const monitorDocumensoDocumentsProvider: HaDataProviderType = {
  getList: async (
    page: number,
    perPage: number,
    _filter: unknown,
    meta: {monitorId: string}
  ) => {
    const {data} = await documensoApi().getMonitorDocumensoDocuments(
      meta.monitorId,
      page,
      perPage
    );
    return {data};
  },
  getOne: notImplemented,
  saveOrUpdate: notImplemented,
  delete: notImplemented,
};

export default monitorDocumensoDocumentsProvider;
