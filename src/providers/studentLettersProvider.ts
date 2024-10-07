import {lettersApi} from "@/providers/api";
import {HaDataProviderType} from "@/providers/HaDataProviderType";
import {toApiIds} from "./feeProvider";

type Params = {
  meta: {
    method: "CREATE" | "UPDATE";
    studentId: string;
    feeId: string;
    feeAmount: number;
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
    const {method, studentId, feeId: raId, feeAmount} = meta || {};

    console.log("FEE AMOUNT", feeAmount);

    const {feeId} = toApiIds(raId);

    if (method === "UPDATE") {
      return lettersApi()
        .updateLettersStatus(payload)
        .then((response) => response.data);
    }
    const {description, filename} = payload[0];
    const {title, rawFile} = filename;
    return lettersApi()
      .createLetter(studentId, title, description, feeId, feeAmount, rawFile)
      .then((response) => [response.data]);
  },
  delete() {
    throw new Error("Not implemented");
  },
};

export default studentLettersProvider;
