import {LetterStats} from "@haapi-b0fc7615/typescript-client";
import {v4 as uuid} from "uuid";
import {lettersApi} from "./api";
import authProvider from "./authProvider";
import {HaDataProviderType, notImplemented} from "./HaDataProviderType";

export type CountResponseType = "count" | "pending" | "rejected" | "received";
export type LetterGetListReponseType = {
  type: CountResponseType;
  value: number;
  id: string;
};

type LetterStatsRecord = LetterStats & {id: string; total: number};

const lettersStatsProvider: HaDataProviderType<LetterStatsRecord | undefined> =
  {
    getList: notImplemented,
    getOne: async () => {
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
    saveOrUpdate: notImplemented,
    delete: notImplemented,
  };

export default lettersStatsProvider;
