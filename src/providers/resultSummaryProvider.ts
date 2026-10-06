import {ResultSummary} from "@haapi-b0fc7615/typescript-client";
import {v4 as uuid} from "uuid";
import {gradesApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const resultSummaryProvider: HaDataProviderType<ResultSummary & {id: string}> =
  {
    getList: () => {
      throw new Error("Function not implemented.");
    },
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
    saveOrUpdate: () => {
      throw new Error("Function not implemented.");
    },
    delete: () => {
      throw new Error("Function not implemented.");
    },
  };

export default resultSummaryProvider;
