import {TemplateDocumenso} from "@haapi-3d601c85/typescript-client";
import {HaDataProviderType, notImplemented} from "./HaDataProviderType";
import {documensoApi} from "./api";

const documensoTemplatesProvider: HaDataProviderType<TemplateDocumenso> = {
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
