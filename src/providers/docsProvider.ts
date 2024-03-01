import {FileType} from "@haapi/typescript-client";
import {HaDataProviderType} from "./HaDataProviderType";
import {filesApi} from "./api";

const docsProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any, meta: any) {
    if (!meta) return [];
    switch (meta.owner) {
      case "SCHOOL":
        return filesApi()
          .getSchoolRegulations()
          .then((result) => result.data);
      case "STUDENT":
        if (meta.type in FileType) {
          return filesApi()
            .getStudentFiles(meta?.studentId, meta.type)
            .then((result) => result.data);
        }
        return [];
      default:
        return [];
    }
  },
  async getOne(id: string, meta: any) {
    if (!meta) return [];
    switch (meta.owner) {
      case "SCHOOL":
        return filesApi()
          .getSchoolRegulationById(id)
          .then((result) => result.data);
      case "STUDENT":
        return filesApi()
          .getStudentFilesById(meta.studentId, id)
          .then((result) => result.data);
      default:
        return [];
    }
  },
  async saveOrUpdate(payload: any) {
    throw new Error("Not implemented.");
  },
  async delete(id: string) {
    throw new Error("Not implemented.");
  },
};

export default docsProvider;
