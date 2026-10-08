import {eventsApi} from "./api";
import {HaDataProviderType, notImplemented} from "./HaDataProviderType";
import {ExportedFile} from "./types";

const exportEventParticipantProvider: HaDataProviderType<ExportedFile> = {
  getList: notImplemented,

  getOne: async (id: string) => {
    return eventsApi()
      .generateEventStudentsParticipantInXlsx(id, {responseType: "arraybuffer"})
      .then((res) => ({id, file: res.data}));
  },

  saveOrUpdate: notImplemented,

  delete: notImplemented,
};

export default exportEventParticipantProvider;
