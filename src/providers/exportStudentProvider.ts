import {
  EnableStatus,
  Sex,
  WorkStudyStatus,
} from "@haapi-b0fc7615/typescript-client";
import {usersApi} from "./api";
import {HaDataProviderType, HaFilter} from "./HaDataProviderType";
import {ExportedFile} from "./types";

interface StudentExportMeta {
  status?: EnableStatus;
  sex?: Sex;
  workStudyStatus?: WorkStudyStatus;
}

const exportStudentProvider: HaDataProviderType<
  ExportedFile,
  HaFilter,
  StudentExportMeta
> = {
  getList: () => {
    throw new Error("Function not implemented.");
  },

  getOne: async (id: string, meta: StudentExportMeta) => {
    const {status, sex, workStudyStatus} = meta;
    return usersApi()
      .generateStudentsInXlsx(
        undefined,
        status,
        sex,
        workStudyStatus,
        undefined,
        {responseType: "arraybuffer"}
      )
      .then((res) => ({id, file: res.data}));
  },

  saveOrUpdate: () => {
    throw new Error("Function not implemented.");
  },

  delete: () => {
    throw new Error("Function not implemented.");
  },
};

export default exportStudentProvider;
