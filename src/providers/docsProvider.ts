import {FileType} from "@haapi/typescript-client";
import {OwnerType} from "src/operations/docs/types";
import {removeExtension} from "../utils/files";
import {HaDataProviderType} from "./HaDataProviderType";
import {MULTIPART_HEADERS} from "./constants";
import {filesApi} from "./api";

const docsProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any, meta: any) {
    if (!meta) return [];
    switch (meta.owner) {
      case OwnerType.SCHOOL:
        return filesApi()
          .getSchoolRegulations()
          .then((result) => result.data);
      case OwnerType.STUDENT:
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
      case OwnerType.SCHOOL:
        return filesApi()
          .getSchoolRegulationById(id)
          .then((result) => result.data);
      case OwnerType.STUDENT:
        return filesApi()
          .getStudentFilesById(meta.studentId, id)
          .then((result) => result.data);
      default:
        return [];
    }
  },
  async saveOrUpdate(payload: any) {
    const {raw, ...doc} = payload[0];

    if (!doc || !raw) return [];

    switch (doc.owner) {
      case OwnerType.SCHOOL:
        return filesApi()
          .uploadSchoolFile(FileType.DOCUMENT, raw.title, raw.rawFile, {
            headers: MULTIPART_HEADERS,
          })
          .then((result) => [result.data]);
      case OwnerType.STUDENT:
        if (doc.type in FileType) {
          return filesApi()
            .uploadStudentFile(
              doc.studentId,
              doc.type,
              raw.title,
              raw.rawFile,
              {headers: MULTIPART_HEADERS}
            )
            .then((result) => [result.data]);
        }
        return [];
      default:
        return [];
    }
  },
  async delete(id: string) {
    throw new Error("Not implemented.");
  },
};

export default docsProvider;
