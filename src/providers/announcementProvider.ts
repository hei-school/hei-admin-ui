import {
  Announcement,
  CreateAnnouncement,
  ReactToAnnouncementRequest,
  Scope,
  WhoamiRoleEnum,
} from "@haapi-b0fc7615/typescript-client";
import {HaDataProviderType, HaMeta} from "./HaDataProviderType";
import {announcementsApi} from "./api";
import authProvider from "./authProvider";

interface AnnouncementFilter {
  from?: Date;
  to?: Date;
  authorRef?: string;
  scope?: Scope;
}

type Params = {
  meta: {
    method: "CREATE" | "UPDATE";
    id: string;
  };
};

type AnnouncementPayload = [ReactToAnnouncementRequest] | [CreateAnnouncement];

// only the method sent in meta tells which payload is saved: a reaction to
// the announcement (UPDATE) or a new announcement (CREATE)
const isReactionPayload = (
  _payload: AnnouncementPayload,
  method: Params["meta"]["method"]
): _payload is [ReactToAnnouncementRequest] => method === "UPDATE";

const announcementProvider: HaDataProviderType<
  Announcement,
  AnnouncementFilter,
  HaMeta,
  AnnouncementPayload,
  Params,
  Announcement[] | undefined
> = {
  getList: async (
    page: number,
    perPage: number,
    filter: AnnouncementFilter
  ) => {
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
            filter.authorRef
          )
          .then((result) => ({data: result.data}));
      default:
        throw new Error("Unexpected role");
    }
  },
  getOne: async (id: string) => {
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
  saveOrUpdate: async (payload: AnnouncementPayload, {meta}: Params) => {
    const {id, method} = meta;
    if (isReactionPayload(payload, method)) {
      return announcementsApi()
        .reactToAnnouncement(id, payload[0])
        .then((result) => [result.data]);
    } else if (method === "CREATE") {
      return announcementsApi()
        .createAnnouncement(payload[0])
        .then((result) => [result.data]);
    }
  },
  delete: async () => {
    throw new Error("Not implemented");
  },
};

export default announcementProvider;
