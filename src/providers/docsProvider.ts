import {FileType} from "@haapi/typescript-client";
import {HaDataProviderType} from "./HaDataProviderType";
import {filesApi} from "./api";

const docsProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any, meta: any) {
    if (meta?.owner! == "SCHOOL") {
      return await filesApi()
        .getSchoolRegulations()
        .then((result) => result.data);
    }
    if (meta?.owner! == "STUDENT") {
      switch (meta?.type!) {
        case FileType.TRANSCRIPT:
          return filesApi()
            .getStudentFiles(meta?.studentId, {
              params: {file_type: FileType.TRANSCRIPT},
            })
            .then((result) => result.data);
        case FileType.OTHER:
          return filesApi()
            .getStudentFiles(meta?.studentId, {
              params: {file_type: FileType.OTHER},
            })
            .then((result) => result.data);
        default:
          console.error("Doc type not known.");
          return [];
      }
    }
    console.error("Doc owner not known");
    return [];
  },
  async getOne(id: string, meta: any) {
    // TODO: WAITING FOR THE API
    if (meta?.owner! == "SCHOOL") {
      return {
        id: "doc_1",
        name: "Document document",
        creation_datetime: "2024-02-23T12:13:43.714Z",
        file_type: "TRANSCRIPT",
        file_url:
          "https://hei-regulations.s3.eu-west-3.amazonaws.com/R%C3%A8glement+de+HEI.pdf",
      };
    } else if (meta?.owner! == "STUDENT") {
      return filesApi()
        .getStudentFilesById(meta.studentId, id)
        .then((result) => result.data);
    } else {
      console.error("Doc owner not known");
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
