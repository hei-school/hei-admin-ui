import {WhoamiRoleEnum} from "@haapi/typescript-client";
import {HaDataProviderType} from "./HaDataProviderType";
import {announcementsApi} from "./api";
import authProvider from "./authProvider";

const role = authProvider.getCachedRole();

const announcementProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    switch (role) {
      case WhoamiRoleEnum.MANAGER:
        return announcementsApi()
          .getAnnouncements(
            page,
            perPage,
            filter.from,
            filter.to,
            filter.authorRef,
            filter.scope
          )
          .then((result) => result.data);
      case WhoamiRoleEnum.STUDENT:
        return announcementsApi()
          .getStudentsAnnouncements(
            page,
            perPage,
            filter.from,
            filter.to,
            filter.authorRef,
            filter.scope
          )
          .then((result) => result.data);
      case WhoamiRoleEnum.TEACHER:
        return announcementsApi()
          .getTeachersAnnouncements(
            page,
            perPage,
            filter.from,
            filter.to,
            filter.authorRef,
            filter.scope
          )
          .then((result) => result.data);
      default:
        throw new Error("Role not known.");
    }
  },
  async getOne(id: string) {
    switch (role) {
      case WhoamiRoleEnum.MANAGER:
        return announcementsApi()
          .getAnnouncementById(id)
          .then((result) => result.data);
      case WhoamiRoleEnum.STUDENT:
        return announcementsApi()
          .getStudentsAnnouncementById(id)
          .then((result) => result.data);
      case WhoamiRoleEnum.TEACHER:
        return announcementsApi()
          .getTeacherAnnouncementById(id)
          .then((result) => result.data);
      default:
        throw new Error("Role not known.");
    }
  },
  async saveOrUpdate(payload: any) {
    return announcementsApi()
      .createAnnouncement(payload[0])
      .then((result) => [result.data]);
  },
  async delete(id: string) {
    throw new Error("Not implemented");
  },
};

export default announcementProvider;
