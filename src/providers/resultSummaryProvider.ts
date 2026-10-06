import {ResultSummary} from "@haapi-b0fc7615/typescript-client";
import {v4 as uuid} from "uuid";
import {gradesApi} from "./api";
import {HaDataProviderType, notImplemented} from "./HaDataProviderType";

const resultSummaryProvider: HaDataProviderType<ResultSummary & {id: string}> =
  {
    getList: notImplemented,
    getOne: async (id: string) => {
      return gradesApi()
        .getResultsSummary(id)
        .then((result) => {
          return {
            id: uuid(),
            ...result.data,
          };
        });
    },
    saveOrUpdate: notImplemented,
    delete: notImplemented,
  };

export default resultSummaryProvider;
