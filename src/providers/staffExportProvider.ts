import {usersApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const staffExportProvider: HaDataProviderType = {
  async getList() {
    throw new Error("Function not implemented.");
  },

  async getOne(id: string) {
    return usersApi()
      .getStaffMembersIntoXlsx({responseType: "arraybuffer"})
      .then((res) => ({id, file: res.data}));
  },

  async saveOrUpdate() {
    throw new Error("Function not implemented.");
  },

  async delete() {
    throw new Error("Function not implemented.");
  },
};

export default staffExportProvider;
