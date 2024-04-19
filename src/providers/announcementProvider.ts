import {WhoamiRoleEnum} from "@haapi/typescript-client";
import {HaDataProviderType} from "./HaDataProviderType";
import {announcementsApi} from "./api";
import authProvider from "./authProvider";

const announcementProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    const role = authProvider.getCachedRole();
    switch (role) {
      case WhoamiRoleEnum.MANAGER:
        return announcementsApi()
          .getAnnouncements(
            page,
            perPage,
            filter.from,
            filter.to,
            filter.authorRef
          )
          .then((result) => result.data);
      case WhoamiRoleEnum.STUDENT:
        return announcementsApi()
          .getStudentsAnnouncements(
            page,
            perPage,
            filter.from,
            filter.to,
            filter.authorRef
          )
          .then((result) => result.data);
      case WhoamiRoleEnum.TEACHER:
        return announcementsApi()
          .getTeachersAnnouncements(
            page,
            perPage,
            filter.from,
            filter.to,
            filter.authorRef
          )
          .then((result) => result.data);
      default:
        throw new Error("Role not known.");
    }
  },
  async getOne(id: string) {
    throw new Error("Function not implemented.");
  },
  async saveOrUpdate(payload: any) {
    return announcementsApi().createAnnouncement(payload[0]);
  },
  async delete(id: string) {
    throw new Error("Not implemented");
  },
};

export default announcementProvider;
