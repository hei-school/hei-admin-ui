import {
  EnableStatus,
  Sex,
  StaffMember,
} from "@haapi-b0fc7615/typescript-client";
import {usersApi} from "./api";
import {HaDataProviderType, HaMeta, notImplemented} from "./HaDataProviderType";

interface StaffFilter {
  status?: EnableStatus;
  sex?: Sex;
  first_name?: string;
  last_name?: string;
}

const staffProvider: HaDataProviderType<
  StaffMember,
  StaffFilter,
  HaMeta,
  StaffMember[]
> = {
  getList: async (page, perPage, filter = {}) => {
    return usersApi()
      .getStaffMembers(
        page,
        perPage,
        filter.status,
        filter.sex,
        filter.first_name,
        filter.last_name
      )
      .then((result) => ({data: result.data}));
  },
  getOne: async (id: string) => {
    return usersApi()
      .getStaffMemberById(id)
      .then((result) => result.data);
  },
  saveOrUpdate: async (staffs: StaffMember[], meta?: {isUpdate: boolean}) => {
    if (meta?.isUpdate) {
      const [staff] = staffs;
      return usersApi()
        .updateStaffMember(staff.id!, staff)
        .then((result) => [result.data]);
    }
    return usersApi()
      .crupdateStaffMembers(staffs)
      .then((result) => result.data);
  },
  delete: notImplemented,
};

export default staffProvider;
