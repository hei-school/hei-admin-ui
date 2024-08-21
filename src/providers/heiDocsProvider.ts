import {Course} from "@haapi/typescript-client";
import {HaDataProviderType} from "./HaDataProviderType";
import {filesApi} from "./api";

const heiDocsProvider: HaDataProviderType = {
  async getList(_page: number, _perPage: number, _filter: any) {
    throw new Error("Not implemented");
  },
  async getOne(_id: string, _meta: any) {
    return filesApi()
      .getSchoolFilesShareLink("/HEI_DOCUMENTS")
      .then(({data}) => data);
  },
  async saveOrUpdate(_payload: Course[]) {
    throw new Error("Not implemented");
  },
  async delete(_id: string) {
    throw new Error("Not implemented");
  },
};

export default heiDocsProvider;
