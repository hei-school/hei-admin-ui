import {eventsApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";
import {ExportedFile} from "./types";

const exportEventParticipantProvider: HaDataProviderType<ExportedFile> = {
  getList: () => {
    throw new Error("Function not implemented.");
  },

  getOne: async (id: string) => {
    return eventsApi()
      .generateEventStudentsParticipantInXlsx(id, {responseType: "arraybuffer"})
      .then((res) => ({id, file: res.data}));
  },

  saveOrUpdate: () => {
    throw new Error("Function not implemented.");
  },

  delete: () => {
    throw new Error("Function not implemented.");
  },
};

export default exportEventParticipantProvider;
