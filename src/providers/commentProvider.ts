import {commentApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const commentProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
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
  async getOne(_id: string) {
    throw new Error("Not implemented");
  },
  async saveOrUpdate(payload: any) {
    const {student_id, observer_id} = payload[0];
    return commentApi()
      .postComment(student_id, observer_id, payload[0])
      .then((response) => [response.data]);
  },
  async delete(_id: string) {
    throw new Error("Not implemented");
  },
};

export default commentProvider;
