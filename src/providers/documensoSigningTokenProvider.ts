import {DocumensoSigningToken} from "@haapi-b0fc7615/typescript-client";
import {HaDataProviderType} from "./HaDataProviderType";
import {documensoApi} from "./api";

const notImplemented = () => {
  throw new Error("Not implemented");
};

const documensoSigningTokenProvider: HaDataProviderType<
  DocumensoSigningToken & {id: string}
> = {
  getList: notImplemented,
  getOne: async (id: string) => {
    const {data} = await documensoApi().getDocumensoDocumentSigningToken(id);
    return {id, ...data};
  },
  saveOrUpdate: notImplemented,
  delete: notImplemented,
};

export default documensoSigningTokenProvider;
