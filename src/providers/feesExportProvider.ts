import {
  AdvancedFeeStatisticsType,
  FeeStatusEnum,
} from "@haapi-b0fc7615/typescript-client";
import {payingApi} from "./api";
import {HaDataProviderType, HaFilter} from "./HaDataProviderType";
import {ExportedFile} from "./types";

interface FeesExportMeta {
  status: FeeStatusEnum;
  fromDueDatetime: Date;
  toDueDatetime: Date;
  type?: AdvancedFeeStatisticsType;
}

const feesExportProvider: HaDataProviderType<
  ExportedFile<Blob | string>,
  HaFilter,
  FeesExportMeta
> = {
  getList: () => {
    throw new Error("Function not implemented.");
  },
  getOne: async (id: string, filter: FeesExportMeta) => {
    const {status, fromDueDatetime, toDueDatetime, type} = filter;
    if (type) {
      return payingApi()
        .exportAllFees(type, fromDueDatetime, toDueDatetime)
        .then(async (res) => {
          const presignedUrl = res.data;
          const fileResponse = await fetch(presignedUrl, {
            method: "GET",
          });
          if (!fileResponse.ok) {
            throw new Error(
              `Failed to download file: ${fileResponse.statusText}`
            );
          }
          const fileBlob = await fileResponse.blob();
          return {
            id,
            file: fileBlob,
          };
        });
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
