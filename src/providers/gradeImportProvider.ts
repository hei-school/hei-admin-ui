import {NOOP_ID} from "@/utils/constants";
import {v4 as uuidv4} from "uuid";
import {HaDataProviderType} from "./HaDataProviderType";
import {gradesApi} from "./api";
const gradeImportProvider: HaDataProviderType = {
  saveOrUpdate: async (_resources, meta) => {
    const {file, comment, mode} = meta.data;
    const examId = meta.meta.examId;

    let response;

    if (mode === "UPDATE") {
      response = await gradesApi().importStudentsExamGradeUpdated(
        examId,
        comment,
        file.rawFile
      );
    } else {
      response = await gradesApi().importStudentsExamGrade(
        examId,
        file.rawFile
      );
    }
    return [
      {
        id: uuidv4(),
        ...response.data,
      },
    ];
  },

  getList: () => {
    throw new Error("Not implemented");
  },

  getOne: async (_resources, meta) => {
    const examId = meta?.examId;
    const response = await gradesApi().getStudentsGradesTemplateForExam(
      examId,
      {responseType: "arraybuffer"}
    );
    return {id: NOOP_ID, data: response.data};
  },
  delete: () => {
    throw new Error("Not implemented");
  },
};

export default gradeImportProvider;
