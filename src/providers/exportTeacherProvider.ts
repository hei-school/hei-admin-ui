import {usersApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const exportTeacherProvider: HaDataProviderType = {
  getList() {
    throw new Error("Not implemented");
  },

  async getOne(id: string) {
    return usersApi()
      .generateTeachersInXlsx({responseType: "arraybuffer"})
      .then((res) => ({id, file: res.data}));
  },

  saveOrUpdate() {
    throw new Error("Not implemented");
  },

  delete() {
    throw new Error("Not implemented");
  },
};

export default exportTeacherProvider;
