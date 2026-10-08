import {NOOP_ID} from "@/utils/constants";
import {StudentImportValidationResult} from "@haapi-b0fc7615/typescript-client";
import {v4 as uuidv4} from "uuid";
import {usersApi} from "./api";
import {
  HaDataProviderType,
  HaFilter,
  HaMeta,
  notImplemented,
} from "./HaDataProviderType";

interface StudentImportPayload {
  due_datetime: string | Date;
  file: {rawFile?: File};
}

type StudentImportTemplate = {id: string; data: string};

type ImportedStudents = StudentImportValidationResult & {id: string};

const studentImportProvider: HaDataProviderType<
  StudentImportTemplate,
  HaFilter,
  HaMeta,
  StudentImportPayload[],
  unknown,
  ImportedStudents[]
> = {
  getList: notImplemented,
  getOne: async () => {
    return usersApi()
      .getStudentImportTemplateURL()
      .then((response) => ({id: NOOP_ID, data: response.data}));
  },
  saveOrUpdate: async (resources) => {
    const {due_datetime, file} = resources[0];
    return usersApi()
      .importStudents(new Date(due_datetime), file.rawFile)
      .then((response) => [{id: uuidv4(), ...response.data}]);
  },
  delete: notImplemented,
};

export default studentImportProvider;
