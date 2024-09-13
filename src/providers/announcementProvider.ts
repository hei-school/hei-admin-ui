import {WhoamiRoleEnum} from "@haapi/typescript-client";
import {HaDataProviderType} from "@/providers/HaDataProviderType";
import {announcementsApi} from "@/providers/api";
import authProvider from "@/providers/authProvider";

const announcementProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    const role = authProvider.getCachedRole();

    let result;
    switch (role) {
      case WhoamiRoleEnum.MANAGER:
        result = await announcementsApi().getAnnouncements(
          page,
          perPage,
          filter.from,
          filter.to,
          filter.authorRef,
          filter.scope
        );
        break;
      case WhoamiRoleEnum.STUDENT:
      case WhoamiRoleEnum.MONITOR:
        result = await announcementsApi().getStudentsAnnouncements(
          page,
          perPage,
          filter.from,
          filter.to,
          filter.authorRef,
          filter.scope
        );
        break;
      case WhoamiRoleEnum.TEACHER:
        result = await announcementsApi().getTeachersAnnouncements(
          page,
          perPage,
          filter.from,
          filter.to,
          filter.authorRef,
          filter.scope
        );
        break;
      default:
        throw new Error("Unexpected role");
    }
    return {
      data: result.data,
    };
  },

  async getOne(id: string) {
    const role = authProvider.getCachedRole();

    let result;
    switch (role) {
      case WhoamiRoleEnum.MANAGER:
        result = await announcementsApi().getAnnouncementById(id);
        break;
      case WhoamiRoleEnum.STUDENT:
      case WhoamiRoleEnum.MONITOR:
        result = await announcementsApi().getStudentsAnnouncementById(id);
        break;
      case WhoamiRoleEnum.TEACHER:
        result = await announcementsApi().getTeacherAnnouncementById(id);
        break;
      default:
        throw new Error("Unexpected role");
    }
    return { data: result.data };
  },

  async saveOrUpdate(payload: any) {
    const result = await announcementsApi().createAnnouncement(payload[0]);
    return { data: [result.data] };
  },

  async delete() {
    throw new Error("Not implemented");
  },
};

export default announcementProvider;
