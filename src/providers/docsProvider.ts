import {FileType} from "@haapi/typescript-client";
import {OwnerType} from "../operations/docs/types";
import {HaDataProviderType} from "./HaDataProviderType";
import {MULTIPART_HEADERS} from "./constants";
import {filesApi} from "./api";

const docsProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, _filter: any, meta: any) {
    if (!meta) return {data: []};
    switch (meta.owner) {
      case OwnerType.SCHOOL:
        return filesApi()
          .getSchoolRegulations(page, perPage)
          .then((result) => ({data: result.data}));
      case OwnerType.STUDENT:
        if (meta.type === "WORK_DOCUMENT") {
          return filesApi()
            .getStudentWorkDocuments(meta.studentId, page, perPage)
            .then((result) => ({data: result.data}));
        }
        if (meta.type in FileType) {
          return filesApi()
            .getUserFiles(meta?.studentId, page, perPage, meta.type)
            .then((result) => ({data: result.data}));
        }
        return {data: []};
      default:
        return {data: []};
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
        if (meta.type === "WORK_DOCUMENT") {
          return filesApi()
            .getStudentWorkDocumentsById(meta.studentId, id)
            .then((result) => result.data);
        }
        return filesApi()
          .getUserFilesById(meta.studentId, id)
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
          .uploadSchoolFile(FileType.DOCUMENT, doc.title, raw.rawFile, {
            headers: MULTIPART_HEADERS,
          })
          .then((result) => [result.data]);
      case OwnerType.STUDENT:
        if (doc.type === "WORK_DOCUMENT") {
          return filesApi()
            .uploadStudentWorkFile(
              doc.studentId,
              doc.title,
              doc.commitment_begin_date,
              doc.experience_type,
              doc.commitment_end_date,
              new Date(),
              raw.rawFile,
              {headers: MULTIPART_HEADERS}
            )
            .then((result) => [result.data]);
        }
        if (doc.type in FileType) {
          return filesApi()
            .uploadUserFile(doc.studentId, doc.type, doc.title, raw.rawFile, {
              headers: MULTIPART_HEADERS,
            })
            .then((result) => [result.data]);
        }
        return [];
      default:
        return [];
    }
  },
  async delete(_id: string) {
    throw new Error("Not implemented.");
  },
};

export default docsProvider;
