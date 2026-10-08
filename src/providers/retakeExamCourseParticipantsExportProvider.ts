import {retakeExamApi} from "./api";
import {HaDataProviderType, HaMeta, notImplemented} from "./HaDataProviderType";
import {ExportedFile} from "./types";

interface RetakeExamCourseParticipantsExportMeta extends HaMeta {
  sessionId: string;
}

const retakeExamCourseParticipantsExportProvider: HaDataProviderType<
  ExportedFile<ArrayBuffer>,
  HaMeta,
  RetakeExamCourseParticipantsExportMeta
> = {
  getList: notImplemented,

  getOne: async (
    courseId: string,
    meta?: RetakeExamCourseParticipantsExportMeta
  ) => {
    const sessionId = meta?.sessionId as string;
    return retakeExamApi()
      .exportRetakeExamParticipantsByCourseIdAndSessionId(sessionId, courseId, {
        responseType: "arraybuffer",
      })
      .then((res) => ({
        id: courseId,
        file: res.data as unknown as ArrayBuffer,
      }));
  },

  saveOrUpdate: notImplemented,

  delete: notImplemented,
};

export default retakeExamCourseParticipantsExportProvider;
