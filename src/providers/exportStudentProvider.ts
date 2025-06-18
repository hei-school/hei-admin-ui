import {usersApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const exportStudentProvider: HaDataProviderType = {
  getList() {
    throw new Error("Not implemented");
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

  saveOrUpdate() {
    throw new Error("Not implemented");
  },

  delete() {
    throw new Error("Not implemented");
  },
};

export default exportStudentProvider;
