import {HaDataProviderType} from "./HaDataProviderType";
import {documensoApi} from "./api";

const notImplemented = () => {
  throw new Error("Not implemented");
};

const documensoFileUrlProvider: HaDataProviderType = {
  getList: notImplemented,
  getOne: async (id: string) => {
    const {data} = await documensoApi().getDocumensoDocumentFileUrl(id);
    return {id, ...data};
  },
  saveOrUpdate: notImplemented,
  delete: notImplemented,
};

export default documensoFileUrlProvider;
