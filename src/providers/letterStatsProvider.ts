import {v4 as uuid} from "uuid";
import {lettersApi} from "./api";
import authProvider from "./authProvider";
import {HaDataProviderType} from "./HaDataProviderType";

export type CountResponseType = "count" | "pending" | "rejected" | "received";
export type LetterGetListReponseType = {
  type: CountResponseType;
  value: number;
  id: string;
};
const lettersStatsProvider: HaDataProviderType = {
  getList: () => {
    throw new Error("Function not implemented.");
  },
  getOne: async (_id: string) => {
    const {role} = authProvider.getCachedWhoami();
    if (role === "MANAGER") {
      return lettersApi()
        .getStudentsLetterStats()
        .then((response) => {
          const {pending, received, rejected} = response.data;
          const total = pending! + received! + rejected!;
          return {...response.data, id: uuid(), total};
        });
    } else if (role === "ADMIN") {
      return lettersApi()
        .getLetterStats(undefined)
        .then((response) => {
          const {pending, received, rejected} = response.data;
          const total = pending! + received! + rejected!;
          return {...response.data, id: uuid(), total};
        });
    }
  },
  saveOrUpdate: () => {
    throw new Error("Function not implemented.");
  },
  delete: () => {
    throw new Error("Function not implemented.");
  },
};

export default lettersStatsProvider;
