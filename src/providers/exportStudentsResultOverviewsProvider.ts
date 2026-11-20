import {ResultOverviewStatus} from "@haapi-3d601c85/typescript-client";
import {usersApi} from "./api";
import {HaDataProviderType, notImplemented} from "./HaDataProviderType";
import {ExportedFile} from "./types";

interface ExportStudentsResultOverviewsMeta {
  status?: ResultOverviewStatus;
}

const exportStudentsResultOverviewsProvider: HaDataProviderType<
  ExportedFile,
  unknown,
  ExportStudentsResultOverviewsMeta
> = {
  getList: notImplemented,

  getOne: async (id: string, meta: ExportStudentsResultOverviewsMeta = {}) => {
    return usersApi()
      .generateStudentResultOverviewsXlsx(id, meta.status, {
        responseType: "arraybuffer",
      })
      .then((res) => ({id, file: res.data}));
  },

  saveOrUpdate: notImplemented,

  delete: notImplemented,
};

export default exportStudentsResultOverviewsProvider;
