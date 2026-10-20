import {ShareInfo} from "@haapi-3d601c85/typescript-client";
import {HaDataProviderType, notImplemented} from "./HaDataProviderType";
import {filesApi} from "./api";

const heiDocsProvider: HaDataProviderType<ShareInfo> = {
  getList: notImplemented,
  getOne: async () => {
    return filesApi()
      .getSchoolFilesShareLink("/HEI_DOCUMENTS")
      .then(({data}) => data);
  },
  saveOrUpdate: notImplemented,
  delete: notImplemented,
};

export default heiDocsProvider;
