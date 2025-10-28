import {RetakeExamSessionList} from "../retakeExamSessions/RetakeExamSessionList";
import {CancellationRetakeExam} from "./CancellationRetakeExam";
import {RetakeExamListShow} from "./RetakeExamListShow";

const retakeExams = {
  list: RetakeExamSessionList,
  show: RetakeExamListShow,
  cancellation: CancellationRetakeExam,
};

export default retakeExams;
