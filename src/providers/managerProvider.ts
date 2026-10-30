import {usersApi} from "@/providers/api";
import {
  HaDataProviderType,
  HaMeta,
  notImplemented,
} from "@/providers/HaDataProviderType";
import {EnableStatus, Manager, Sex} from "@haapi-3d601c85/typescript-client";

interface ManagerFilter {
  status?: EnableStatus;
  sex?: Sex;
}

const managerProvider: HaDataProviderType<Manager, ManagerFilter, HaMeta> = {
  getList: async (page, perPage, filter = {}) => {
    return usersApi()
      .getManagers(page, perPage, filter.status, filter.sex)
      .then((response) => ({data: response.data}));
  },
  getOne: async (id: string) => {
    return usersApi()
      .getManagerById(id)
      .then((response) => response.data);
  },
  saveOrUpdate: notImplemented,
  delete: notImplemented,
};

export default managerProvider;
