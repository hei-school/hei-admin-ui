import {payingApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";
import {v4 as uuid} from "uuid";

const feesExportProvider: HaDataProviderType = {
  async getList() {
    throw new Error("Function not implemented.");
  },

  async getOne(_id: string, meta) {
    const {status, fromDueDatetime, toDueDatetime} = meta;
    return payingApi()
      .generateFeesListAsXlsx(status, fromDueDatetime, toDueDatetime, {
        responseType: "arraybuffer",
      })
      .then((res) => ({id: uuid(), file: res.data}));
  },

  async saveOrUpdate() {
    throw new Error("Function not implemented.");
  },

  async delete() {
    throw new Error("Function not implemented.");
  },
};

export default feesExportProvider;
