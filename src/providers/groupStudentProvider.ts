import {HaDataProviderType} from "./HaDataProviderType";
import {groupsApi} from "./api";

const groupStudentProvider: HaDataProviderType = {
  getList: (
    page: number,
    perPage: number,
    filter: {first_name: string},
    meta: {groupId: string}
  ) => {
    return groupsApi()
      .getStudentsByGroupId(meta.groupId, page, perPage, filter.first_name)
      .then((result) => ({data: result.data}));
  },
  getOne: () => {
    throw new Error("Function not implemented.");
  },
  saveOrUpdate: () => {
    throw new Error("Function not implemented.");
  },
  delete: () => {
    throw new Error("Not implemented");
  },
};

export default groupStudentProvider;
