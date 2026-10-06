import {Comment} from "@haapi-b0fc7615/typescript-client";
import {commentApi} from "./api";
import {HaDataProviderType, HaMeta, notImplemented} from "./HaDataProviderType";

interface CommentFilter {
  studentId?: string;
}

interface CommentPayload {
  student_id: string;
  observer_id: string;
  content: string;
}

const commentProvider: HaDataProviderType<
  Comment,
  CommentFilter,
  HaMeta,
  CommentPayload[]
> = {
  async getList(page: number, perPage: number, filter: CommentFilter) {
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
  getOne: notImplemented,
  async saveOrUpdate(payload: CommentPayload[]) {
    const {student_id, observer_id} = payload[0];
    return commentApi()
      .postComment(student_id, observer_id, payload[0])
      .then((response) => [response.data]);
  },
  delete: notImplemented,
};

export default commentProvider;
