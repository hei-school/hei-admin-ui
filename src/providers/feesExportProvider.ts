import {payingApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const feesExportProvider: HaDataProviderType = {
  getList() {
    throw new Error("Not implemented");
  },

  async getOne(id: string, meta) {
    const {status, fromDueDatetime, toDueDatetime} = meta;
    return payingApi()
      .generateFeesListAsXlsx(status, fromDueDatetime, toDueDatetime, {
        responseType: "arraybuffer",
      })
      .then((res) => ({id, file: res.data}));
  },

  async saveOrUpdate() {
    throw new Error("Not implemented");
  },

  async delete() {
    throw new Error("Not implemented");
  },
};

export default feesExportProvider;
