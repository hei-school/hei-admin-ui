import {DocumensoFileUrl} from "@haapi-b0fc7615/typescript-client";
import {HaDataProviderType, notImplemented} from "./HaDataProviderType";
import {documensoApi} from "./api";

const documensoFileUrlProvider: HaDataProviderType<
  DocumensoFileUrl & {id: string}
> = {
  getList: notImplemented,
  getOne: async (id: string) => {
    const {data} = await documensoApi().getDocumensoDocumentFileUrl(id);
    return {id, ...data};
  },
  saveOrUpdate: notImplemented,
  delete: notImplemented,
};

export default documensoFileUrlProvider;
