import {lettersApi} from "@/providers/api";
import {HaDataProviderType} from "@/providers/HaDataProviderType";

const lettersProvider: HaDataProviderType = {
  getList: async (page, perPage, filter) => {
    const {studentId} = filter;
    if (studentId) {
      return lettersApi()
        .getLettersByStudentId(studentId, page, perPage)
        .then((response) => response.data);
    } else {
      return lettersApi()
        .getLetters(page, perPage)
        .then((response) => response.data) as any;
    }
  },
  getOne: async (id: string) => {
    return lettersApi()
      .getLetterById(id)
      .then((response) => response.data);
  },
  saveOrUpdate: async (
    payload: any,
    {method}: {method: "CREATE" | "UPDATE"}
  ) => {
    if (method === "UPDATE") {
      return lettersApi()
        .updateLettersStatus(payload)
        .then((response) => response.data);
    }
    const {student_id, description, file} = payload;
    return lettersApi()
      .createLetter(student_id, description, file)
      .then((response) => response.data);
  },
  delete(_id: string) {
    throw new Error("Not implemented");
  },
};

export default lettersProvider;
