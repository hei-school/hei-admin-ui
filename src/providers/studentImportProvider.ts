import {v4 as uuidv4} from "uuid";
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
    const {due_datetime, file} = resources[0];
    return usersApi()
      .importStudents(new Date(due_datetime), file.rawFile)
      .then((response) => [{id: uuidv4(), ...response.data}]);
  },
  delete: () => {
    throw new Error("Function not implemented.");
  },
};

export default studentImportProvider;
