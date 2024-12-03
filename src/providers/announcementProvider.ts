import {WhoamiRoleEnum} from "@haapi/typescript-client";
import {HaDataProviderType} from "./HaDataProviderType";
import {announcementsApi} from "./api";
import authProvider from "./authProvider";

const announcementProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    const role = authProvider.getCachedRole();

    switch (role) {
      case WhoamiRoleEnum.ADMIN:
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
          .then((result) => ({data: result.data}));
      case WhoamiRoleEnum.MONITOR:
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
          .then((result) => ({data: result.data}));
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
          .then((result) => ({data: result.data}));
      default:
        throw new Error("Unexpected role");
    }
  },
  async getOne(id: string) {
    const role = authProvider.getCachedRole();

    switch (role) {
      case WhoamiRoleEnum.ADMIN:
      case WhoamiRoleEnum.MANAGER:
        return announcementsApi()
          .getAnnouncementById(id)
          .then((result) => result.data);
      case WhoamiRoleEnum.MONITOR:
      case WhoamiRoleEnum.STUDENT:
        return announcementsApi()
          .getStudentsAnnouncementById(id)
          .then((result) => result.data);
      case WhoamiRoleEnum.TEACHER:
        return announcementsApi()
          .getTeacherAnnouncementById(id)
          .then((result) => result.data);
      default:
        throw new Error("Unexpected role");
    }
  },
  async saveOrUpdate(payload: any) {
    return announcementsApi()
      .createAnnouncement(payload[0])
      .then((result) => [result.data]);
  },
  async delete() {
    throw new Error("Not implemented");
  },
};

export default announcementProvider;
