import {usersApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const studentImportProvider: HaDataProviderType = {
  getList: () => {
    throw new Error("Function not implemented.");
  },
  getOne: () => {
    throw new Error("Function not implemented.");
  },
  saveOrUpdate: async (resources) => {
    const {dueDatetime, file} = resources[0];
    return usersApi()
      .importStudents(dueDatetime, file.rawFile)
      .then((response) => response.data);
  },
  delete: () => {
    throw new Error("Function not implemented.");
  },
};

export default studentImportProvider;
