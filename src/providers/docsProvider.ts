import {
  FileInfo,
  FileType,
  ProfessionalExperienceFileTypeEnum,
  WhoamiRoleEnum,
  WorkDocumentInfo,
} from "@haapi-b0fc7615/typescript-client";
import {OwnerType} from "../operations/docs/types";
import {
  HaDataProviderType,
  HaFilter,
  notImplemented,
} from "./HaDataProviderType";
import {filesApi} from "./api";
import {MULTIPART_HEADERS} from "./constants";

type DocOwner = OwnerType | WhoamiRoleEnum;

// sent by the docs list and show pages through the query meta
interface DocsMeta {
  owner?: DocOwner;
  type?: string;
  userId: string;
}

// built by DocCreateDialog: the dates are ISO strings, raw holds the uploaded file
interface DocPayload {
  raw?: {rawFile?: File};
  owner?: DocOwner;
  type?: string;
  userId: string;
  title: string;
  experience_type: ProfessionalExperienceFileTypeEnum;
  commitment_begin_date: string;
  commitment_end_date?: string;
}

const isFileType = (type?: string): type is FileType =>
  type !== undefined && type in FileType;

const toDate = (isoDate?: string) => (isoDate ? new Date(isoDate) : undefined);

// getOne renvoie un tableau vide quand le propriétaire ou les meta ne sont pas reconnus
type DocResource = FileInfo | WorkDocumentInfo | never[];

const docsProvider: HaDataProviderType<
  DocResource,
  HaFilter,
  DocsMeta,
  DocPayload[],
  unknown,
  Array<FileInfo | WorkDocumentInfo>
> = {
  async getList(
    page: number,
    perPage: number,
    _filter: unknown,
    meta?: DocsMeta
  ) {
    if (!meta) return {data: []};
    switch (meta.owner) {
      case OwnerType.STUDENT:
        if (meta.type === "WORK_DOCUMENT") {
          return filesApi()
            .getStudentWorkDocuments(meta.userId, page, perPage)
            .then((result) => ({data: result.data}));
        }
        if (isFileType(meta.type)) {
          return filesApi()
            .getUserFiles(meta?.userId, page, perPage, meta.type)
            .then((result) => ({data: result.data}));
        }
        return {data: []};
      case OwnerType.TEACHER:
        if (meta.type === "OTHER") {
          return filesApi()
            .getUserFiles(meta?.userId, page, perPage, meta.type)
            .then((result) => ({data: result.data}));
        }
        return {data: []};
      default:
        return {data: []};
    }
  },
  async getOne(id: string, meta?: DocsMeta) {
    if (!meta) return [];
    switch (meta.owner) {
      case OwnerType.STUDENT:
        if (meta.type === "WORK_DOCUMENT") {
          return filesApi()
            .getStudentWorkDocumentsById(meta.userId, id)
            .then((result) => result.data);
        }
        return filesApi()
          .getUserFilesById(meta.userId, id)
          .then((result) => result.data);
      case OwnerType.STAFF_MEMBER:
      case OwnerType.TEACHER:
        return filesApi()
          .getUserFilesById(meta.userId, id)
          .then((result) => result.data);

      default:
        return [];
    }
  },
  async saveOrUpdate(payload: DocPayload[]) {
    const {raw, ...doc} = payload[0];

    if (!doc || !raw) return [];

    switch (doc.owner) {
      case OwnerType.SCHOOL:
      case OwnerType.STUDENT:
        if (doc.type === "WORK_DOCUMENT") {
          return filesApi()
            .uploadStudentWorkFile(
              doc.userId,
              doc.title,
              new Date(doc.commitment_begin_date),
              doc.experience_type,
              toDate(doc.commitment_end_date),
              new Date(),
              raw.rawFile,
              {headers: MULTIPART_HEADERS}
            )
            .then((result) => [result.data]);
        }
        if (isFileType(doc.type)) {
          return filesApi()
            .uploadUserFile(doc.userId, doc.type, doc.title, raw.rawFile, {
              headers: MULTIPART_HEADERS,
            })
            .then((result) => [result.data]);
        }
        return [];
      case OwnerType.TEACHER:
        if (isFileType(doc.type)) {
          return filesApi()
            .uploadUserFile(doc.userId, doc.type, doc.title, raw.rawFile, {
              headers: MULTIPART_HEADERS,
            })
            .then((result) => [result.data]);
        }
        return [];
      default:
        return [];
    }
  },
  delete: notImplemented,
};

export default docsProvider;
