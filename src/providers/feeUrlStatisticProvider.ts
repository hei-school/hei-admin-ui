import {
  AdvancedFeeStatisticsType,
  FeeStatusEnum,
} from "@haapi-b0fc7615/typescript-client";
import {payingApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

type FeesExportFilter = {
  monthFrom?: string;
  monthTo?: string;
  status?: FeeStatusEnum;
  type: AdvancedFeeStatisticsType;
};

const feeUrlStatisticProvider: HaDataProviderType = {
  getList: async (_page, _perPage, filter: FeesExportFilter) => {
    const {monthFrom, monthTo, status, type} = filter;

    return payingApi()
      .exportAdvancedFeesStats(monthFrom, monthTo, status, type)
      .then((response) => ({
        data: response.data,
      }));
  },
  getOne: () => {
    throw new Error("Function not implemented.");
  },
  saveOrUpdate: () => {
    throw new Error("Function not implemented.");
  },
  delete: () => {
    throw new Error("Function not implemented.");
  },
};

export default feeUrlStatisticProvider;
