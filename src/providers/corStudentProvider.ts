import {CorCommentInfo} from "@haapi-b0fc7615/typescript-client";
import {corApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const corStudentProvider: HaDataProviderType = {
  getList: () => {
    throw new Error("Function not implemented.");
  },
  getOne: () => {
    throw new Error("Function not implemented.");
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
