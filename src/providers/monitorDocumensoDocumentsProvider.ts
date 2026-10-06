import {DocumensoDocument} from "@haapi-b0fc7615/typescript-client";
import {HaDataProviderType, HaFilter} from "./HaDataProviderType";
import {documensoApi} from "./api";

interface MonitorDocumensoMeta {
  monitorId: string;
}

const notImplemented = () => {
  throw new Error("Not implemented");
};

const monitorDocumensoDocumentsProvider: HaDataProviderType<
  DocumensoDocument,
  HaFilter,
  MonitorDocumensoMeta
> = {
  getList: async (
    page: number,
    perPage: number,
    _filter: unknown,
    meta: MonitorDocumensoMeta
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
