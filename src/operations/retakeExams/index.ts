import {RetakeExamSessionList} from "../retakeExamSessions/RetakeExamSessionList";
import {CancellationRetakeExam} from "./CancellationRetakeExam";
import {ListRetakeExamsForStudentSpecific} from "./ListRetakeExamsForStudentSpecific";
import {RetakeExamListShow} from "./RetakeExamListShow";

const retakeExams = {
  list: RetakeExamSessionList,
  show: RetakeExamListShow,
  cancellation: CancellationRetakeExam,
  listMyRetakes: ListRetakeExamsForStudentSpecific,
};

export default retakeExams;
