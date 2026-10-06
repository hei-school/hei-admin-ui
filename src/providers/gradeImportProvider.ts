import {NOOP_ID} from "@/utils/constants";
import {ImportGradeResult} from "@haapi-b0fc7615/typescript-client";
import {v4 as uuidv4} from "uuid";
import {HaDataProviderType, HaFilter} from "./HaDataProviderType";
import {gradesApi} from "./api";

interface GradeImportMeta {
  examId: string;
}

// CreateParams transmis par dataProvider.create
interface GradeImportParams {
  data: {
    file: {rawFile?: File};
    comment: string;
    mode: string;
  };
  meta: GradeImportMeta;
}

type GradeImportTemplate = {id: string; data: File};

type ImportedGrades = ImportGradeResult & {id: string};

const gradeImportProvider: HaDataProviderType<
  GradeImportTemplate,
  HaFilter,
  GradeImportMeta,
  unknown,
  GradeImportParams,
  ImportedGrades[]
> = {
  saveOrUpdate: async (_resources, meta: GradeImportParams) => {
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

  getOne: async (_resources, meta: GradeImportMeta) => {
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
