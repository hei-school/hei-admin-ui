import {groupsApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const exportGroupProvider: HaDataProviderType = {
  async getList() {
    throw new Error("Function not implemented.");
  },

  async getOne(id: string) {
    return groupsApi()
      .generateStudentsGroupInXlsx(id, {responseType: "arraybuffer"})
      .then((res) => ({id, file: res.data}));
  },

  async saveOrUpdate() {
    throw new Error("Function not implemented.");
  },

  async delete() {
    throw new Error("Function not implemented.");
  },
};

export default exportGroupProvider;
