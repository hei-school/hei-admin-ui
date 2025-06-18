import {eventsApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const exportEventParticipantProvider: HaDataProviderType = {
  getList() {
    throw new Error("Not implemented");
  },

  async getOne(id: string) {
    return eventsApi()
      .generateEventStudentsParticipantInXlsx(id, {responseType: "arraybuffer"})
      .then((res) => ({id, file: res.data}));
  },

  saveOrUpdate() {
    throw new Error("Not implemented");
  },

  delete() {
    throw new Error("Not implemented");
  },
};

export default exportEventParticipantProvider;
