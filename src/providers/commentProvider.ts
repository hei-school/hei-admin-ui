import {commentApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const commentProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: {studentId?: string}) {
    const {studentId} = filter;
    if (studentId) {
      return commentApi()
        .getStudentComments(studentId, undefined, page, perPage)
        .then((response) => ({data: response.data}));
    } else {
      return commentApi()
        .getComments(page, perPage)
        .then((response) => ({data: response.data}));
    }
  },
  async getOne() {
    throw new Error("Not implemented");
  },
  async saveOrUpdate(
    payload: {student_id: string; observer_id: string; content: string}[]
  ) {
    const {student_id, observer_id} = payload[0];
    return commentApi()
      .postComment(student_id, observer_id, payload[0])
      .then((response) => [response.data]);
  },
  async delete() {
    throw new Error("Not implemented");
  },
};

export default commentProvider;
