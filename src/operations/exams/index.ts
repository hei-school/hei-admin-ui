import {ExamCreate} from "./ExamCreate";
import {ExamList} from "./ExamList";

export * from "./components";
export * from "./hooks";
export * from "./utils";

export {ExamCreate} from "./ExamCreate";
export {ExamEditDialog} from "./ExamEdit";
export {ExamList} from "./ExamList";

const exams = {
  list: ExamList,
  create: ExamCreate,
};

export default exams;
