import {usersApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const exportTeacherProvider: HaDataProviderType = {
  async getList() {
    throw new Error("Function not implemented.");
  },

  async getOne(id: string) {
    return usersApi()
      .generateTeachersInXlsx({responseType: "arraybuffer"})
      .then((res) => ({id, file: res.data}));
  },

  async saveOrUpdate() {
    throw new Error("Function not implemented.");
  },

  async delete() {
    throw new Error("Function not implemented.");
  },
};

export default exportTeacherProvider;
