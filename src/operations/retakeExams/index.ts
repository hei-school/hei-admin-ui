import {CancellationRetakeExam} from "./CancellationRetakeExam";
import {RetakeExamListShow} from "./RetakeExamListShow";
import {RetakeExamSessionLists} from "./RetakeExamSessionLists";

const retakeExams = {
  list: RetakeExamSessionLists,
  show: RetakeExamListShow,
  cancellation: CancellationRetakeExam,
};

export default retakeExams;
