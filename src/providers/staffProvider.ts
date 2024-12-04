import {StaffMember} from "@haapi/typescript-client";
import {usersApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const staffProvider: HaDataProviderType = {
  getList: async (page, perPage, filter = {}) => {
    return usersApi()
      .getStaffMembers(
        page,
        perPage,
        filter.status,
        filter.sex,
        filter.firstName,
        filter.lastName
      )
      .then((result) => ({data: result.data}));
  },
  getOne: async (id: string) => {
    return usersApi()
      .getStaffMemberById(id)
      .then((result) => result.data);
  },
  saveOrUpdate: async (users: Array<StaffMember>, meta: any) => {
    if (meta?.isUpdate) {
      const [staff] = users;
      return usersApi()
        .updateStaffMember(staff.id!, staff)
        .then((result) => result.data);
    }
    return usersApi()
      .crupdateStaffMembers(users)
      .then((result) => result.data);
  },
  delete: () => {
    throw new Error("Function not implemented.");
  },
};

export default staffProvider;
