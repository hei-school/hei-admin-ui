import {Student} from "@haapi-b0fc7615/typescript-client";
import {HaDataProviderType, notImplemented} from "./HaDataProviderType";
import {groupsApi} from "./api";

interface GroupStudentFilter {
  first_name: string;
}

interface GroupStudentMeta {
  groupId: string;
}

const groupStudentProvider: HaDataProviderType<
  Student,
  GroupStudentFilter,
  GroupStudentMeta
> = {
  getList: (
    page: number,
    perPage: number,
    filter: GroupStudentFilter,
    meta: GroupStudentMeta
  ) => {
    return groupsApi()
      .getStudentsByGroupId(meta.groupId, page, perPage, filter.first_name)
      .then((result) => ({data: result.data}));
  },
  getOne: notImplemented,
  saveOrUpdate: notImplemented,
  delete: notImplemented,
};

export default groupStudentProvider;
