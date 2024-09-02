import {lettersApi} from "@/providers/api";
import {HaDataProviderType} from "@/providers/HaDataProviderType";

type Params = {
  meta: {
    method: "CREATE" | "UPDATE";
    studentId: string;
  };
};
const studentLettersProvider: HaDataProviderType = {
  getList: async (page, perPage, _sort, meta) => {
    const {studentId} = meta;

    return lettersApi()
      .getLettersByStudentId(studentId, page, perPage)
      .then((response) => response.data);
  },
  getOne: async (id: string) => {
    return lettersApi()
      .getLetterById(id)
      .then((response) => response.data);
  },
  saveOrUpdate: async (payload: any, {meta}: Params) => {
    const {method, studentId} = meta || {};
    if (method === "UPDATE") {
      return lettersApi()
        .updateLettersStatus(payload)
        .then((response) => response.data);
    }
    const {description, filename} = payload[0];
    const {title, rawFile} = filename;
    return lettersApi()
      .createLetter(studentId, description, title, rawFile)
      .then((response) => response.data);
  },
  delete(_id: string) {
    throw new Error("Not implemented");
  },
};

export default studentLettersProvider;
