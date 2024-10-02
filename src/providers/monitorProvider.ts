import {usersApi} from "@/providers/api";

const monitorProvider = {
  async getList(page: number, perPage: number, filter: any) {
    const result = await usersApi().getMonitors(
      page,
      perPage,
      filter?.ref,
      filter?.first_name,
      filter?.last_name,
      filter?.status
    );

    return {
      data: result.data,
    };
  },

  async getOne(id: string) {
    const result = await usersApi().getMonitorById(id);
    return result.data;
  },

  async saveOrUpdate(users: Array<any>, meta: any) {
    if (meta?.isUpdate) {
      const [monitor] = users;
      const result = await usersApi().updateMonitorById(monitor.id, monitor);
      return [result.data];
    } else {
      const result = await usersApi().createOrUpdateMonitors(users);
      return result.data;
    }
  },

  async delete(_id: string) {
    throw new Error("Not implemented");
  },
};

export default monitorProvider;