import {
  AdvancedFeeStatisticsType,
  FeeStatusEnum,
} from "@haapi-b0fc7615/typescript-client";
import {payingApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const feesExportProvider: HaDataProviderType = {
  getList: () => {
    throw new Error("Function not implemented.");
  },
  getOne: async (
    id: string,
    filter: {
      status: FeeStatusEnum;
      fromDueDatetime: Date;
      toDueDatetime: Date;
      type?: AdvancedFeeStatisticsType;
    }
  ) => {
    const {status, fromDueDatetime, toDueDatetime, type} = filter;
    if (type) {
      return payingApi()
        .exportAllFees(type, fromDueDatetime, toDueDatetime)
        .then((res) => ({
          id,
          file: res.data,
        }));
    }
    return payingApi()
      .generateFeesListAsXlsx(status, fromDueDatetime, toDueDatetime, {
        responseType: "arraybuffer",
      })
      .then((res) => ({
        id,
        file: res.data,
      }));
  },
  saveOrUpdate: () => {
    throw new Error("Function not implemented.");
  },
  delete: () => {
    throw new Error("Function not implemented.");
  },
};

export default feesExportProvider;
