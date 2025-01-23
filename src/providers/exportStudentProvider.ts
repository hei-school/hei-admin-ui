import {usersApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const exportStudentProvider: HaDataProviderType = {
  async getList() {
    throw new Error("Function not implemented.");
  },

  async getOne(id: string, meta) {
    const {status, sex, workStudyStatus} = meta;
    return usersApi()
      .generateStudentsInXlsx(
        undefined,
        status,
        sex,
        workStudyStatus,
        undefined,
        {responseType: "arraybuffer"}
      )
      .then((res) => ({id, file: res.data}));
  },

  async saveOrUpdate() {
    throw new Error("Function not implemented.");
  },

  async delete() {
    throw new Error("Function not implemented.");
  },
};

export default exportStudentProvider;
