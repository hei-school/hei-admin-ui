import {teachingApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const exportGroupProvider: HaDataProviderType = {
  getList() {
    throw new Error("Not implemented");
  },

  async getOne(id: string) {
    return teachingApi()
      .generateStudentsGroupInXlsx(id, {responseType: "arraybuffer"})
      .then((res) => ({id, file: res.data}));
  },

  saveOrUpdate() {
    throw new Error("Not implemented");
  },

  delete() {
    throw new Error("Not implemented");
  },
};

export default exportGroupProvider;
