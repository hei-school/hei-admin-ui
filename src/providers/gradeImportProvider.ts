import {v4 as uuidv4} from "uuid";
import {gradesApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const gradeImportProvider: HaDataProviderType = {
  getList: () => {
    throw new Error("Function not implemented.");
  },

  getOne: async () => {
    throw new Error("Function not implement.");
  },

  saveOrUpdate: async (resources) => {
    const {exam_id, file} = resources[0];

    return gradesApi()
      .importStudentsExamGrade(exam_id, file.rawFile)
      .then((response) => [{id: uuidv4(), ...response.data}]);
  },

  delete: () => {
    throw new Error("Function not implemented.");
  },
};

export default gradeImportProvider;
