import {lettersApi} from "@/providers/api";
import {HaDataProviderType} from "@/providers/HaDataProviderType";

type Params = {
  meta: {
    method: "CREATE" | "UPDATE";
    studentId: string;
  };
};
const studentLettersProvider: HaDataProviderType = {
  getList: async (page, perPage, filter, meta) => {
    const {studentId} = meta;
    const {status} = filter;

    return lettersApi()
      .getLettersByStudentId(studentId, page, perPage, status)
      .then((result) => ({data: result.data}));
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
    const feeId = undefined;
    const amount = undefined;
    return lettersApi()
      .createLetter(studentId, title, description, feeId, amount, rawFile)
      .then((response) => [response.data]);
  },
  delete() {
    throw new Error("Not implemented");
  },
};

export default studentLettersProvider;
