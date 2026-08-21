import {CorCommentInfo} from "@haapi-3d601c85/typescript-client";
import {corApi} from "./api";
import authProvider from "./authProvider";
import {HaDataProviderType} from "./HaDataProviderType";

const corStudentProvider: HaDataProviderType = {
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

  saveOrUpdate: async (payload: (CorCommentInfo & {id: string})[]) => {
    const {id: CorId, ...commentInfo} = payload[0];
    return corApi()
      .commentCorById(CorId, commentInfo)
      .then((response) => {
        return [{id: CorId, ...response.data}];
      });
  },
  delete: () => {
    throw new Error("Function not implemented.");
  },
};

export default corStudentProvider;
