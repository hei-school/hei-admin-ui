import {usersApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const exportStudentProvider: HaDataProviderType = {
  getList: () => {
    throw new Error("Function not implemented.");
  },

  getOne: async (id: string, meta) => {
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

  saveOrUpdate: () => {
    throw new Error("Function not implemented.");
  },

  delete: () => {
    throw new Error("Function not implemented.");
  },
};

export default exportStudentProvider;
