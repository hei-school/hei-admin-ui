import {HaDataProviderType} from "./HaDataProviderType";
import {filesApi} from "./api";

const heiDocsProvider: HaDataProviderType = {
  getList: () => {
    throw new Error("Not implemented");
  },
  getOne: async () => {
    return filesApi()
      .getSchoolFilesShareLink("/HEI_DOCUMENTS")
      .then(({data}) => data);
  },
  saveOrUpdate: () => {
    throw new Error("Not implemented");
  },
  delete: () => {
    throw new Error("Not implemented");
  },
};

export default heiDocsProvider;
