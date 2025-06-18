import {CreateComment} from "@haapi/typescript-client";
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
  getOne() {
    throw new Error("Not implemented");
  },
  async saveOrUpdate(payload: CreateComment[]) {
    const {student_id, observer_id} = payload[0];
    return commentApi()
      .postComment(student_id as string, observer_id as string, payload[0])
      .then((response) => [response.data]);
  },
  delete() {
    throw new Error("Not implemented");
  },
};

export default commentProvider;
