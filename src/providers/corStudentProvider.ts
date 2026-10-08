import {
  Cor,
  CorComment,
  CorCommentInfo,
} from "@haapi-b0fc7615/typescript-client";
import {corApi} from "./api";
import authProvider from "./authProvider";
import {
  HaDataProviderType,
  HaFilter,
  HaMeta,
  notImplemented,
} from "./HaDataProviderType";

type CorCommentPayload = CorCommentInfo & {id: string};

type CommentedCor = CorComment & {id: string};

const corStudentProvider: HaDataProviderType<
  Cor,
  HaFilter,
  HaMeta,
  CorCommentPayload[],
  unknown,
  CommentedCor[]
> = {
  getList: async (page: number, perPage: number) => {
    const {id: studentId} = authProvider.getCachedWhoami();
    return corApi()
      .getStudentCors(studentId!, page, perPage)
      .then((response) => ({data: response.data}));
  },
  getOne: async (id: string) => {
    return corApi()
      .getCorById(id)
      .then((response) => response.data);
  },

  saveOrUpdate: async (payload: CorCommentPayload[]) => {
    const {id: CorId, ...commentInfo} = payload[0];
    return corApi()
      .commentCorById(CorId, commentInfo)
      .then((response) => {
        return [{id: CorId, ...response.data}];
      });
  },
  delete: notImplemented,
};

export default corStudentProvider;
