import {retakeExamApi} from "./api";
import {HaDataProviderType, HaMeta, notImplemented} from "./HaDataProviderType";
import {ExportedFile} from "./types";

const retakeExamSessionParticipantsExportProvider: HaDataProviderType<
  ExportedFile<ArrayBuffer>,
  HaMeta,
  HaMeta
> = {
  getList: notImplemented,

  getOne: async (sessionId: string) => {
    return retakeExamApi()
      .exportRetakeExamParticipantsBySessionId(sessionId, undefined, {
        responseType: "arraybuffer",
      })
      .then((res) => ({
        id: sessionId,
        file: res.data as unknown as ArrayBuffer,
      }));
  },

  saveOrUpdate: notImplemented,

  delete: notImplemented,
};

export default retakeExamSessionParticipantsExportProvider;
