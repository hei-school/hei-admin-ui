import {HaDataProviderType} from "./HaDataProviderType";
import {documensoApi} from "./api";

const notImplemented = () => {
  throw new Error("Not implemented");
};

const documensoTemplatesProvider: HaDataProviderType = {
  getList: async (page: number, perPage: number) => {
    const {data} = await documensoApi().getDocumensoTemplates(page, perPage);
    return {data};
  },
  getOne: notImplemented,
  saveOrUpdate: async () => {
    const {data} = await documensoApi().syncDocumensoTemplates();
    return data;
  },
  delete: notImplemented,
};

export default documensoTemplatesProvider;
