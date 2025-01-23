import {eventsApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const exportEventParticipantProvider: HaDataProviderType = {
  async getList() {
    throw new Error("Function not implemented.");
  },

  async getOne(id: string) {
    return eventsApi()
      .generateEventStudentsParticipantInXlsx(id, {responseType: "arraybuffer"})
      .then((res) => ({id, file: res.data}));
  },

  async saveOrUpdate() {
    throw new Error("Function not implemented.");
  },

  async delete() {
    throw new Error("Function not implemented.");
  },
};

export default exportEventParticipantProvider;
