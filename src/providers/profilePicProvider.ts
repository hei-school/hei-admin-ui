import {
  Organizer,
  StaffMember,
  WhoamiRoleEnum,
} from "@haapi-b0fc7615/typescript-client";
import {
  HaDataProviderType,
  HaFilter,
  HaMeta,
  notImplemented,
} from "./HaDataProviderType";
import {usersApi} from "./api";
import {MULTIPART_HEADERS} from "./constants";
import {User} from "./types";

const PIC_OPTIONS = {
  headers: MULTIPART_HEADERS,
};

interface ProfilePicturePayload {
  id: string;
  role?: WhoamiRoleEnum;
  rawFile?: File;
}

type UserWithPicture = User | StaffMember | Organizer;

const profilePicProvider: HaDataProviderType<
  UserWithPicture,
  HaFilter,
  HaMeta,
  ProfilePicturePayload[],
  unknown,
  UserWithPicture[] | undefined
> = {
  getList: notImplemented,
  getOne: notImplemented,
  saveOrUpdate: async (payload) => {
    const user = payload[0];
    switch (user?.role) {
      case WhoamiRoleEnum.STUDENT:
        return usersApi()
          .uploadStudentProfilePicture(user?.id, user?.rawFile, PIC_OPTIONS)
          .then((result) => [result.data]);
      case WhoamiRoleEnum.TEACHER:
        return usersApi()
          .uploadTeacherProfilePicture(user?.id, user?.rawFile, PIC_OPTIONS)
          .then((result) => [result.data]);
      case WhoamiRoleEnum.MANAGER:
        return usersApi()
          .uploadManagerProfilePicture(user?.id, user?.rawFile, PIC_OPTIONS)
          .then((result) => [result.data]);
      case WhoamiRoleEnum.ADMIN:
        return usersApi()
          .uploadAdminProfilePicture(user?.id, user?.rawFile, PIC_OPTIONS)
          .then((result) => [result.data]);
      case WhoamiRoleEnum.STAFF_MEMBER:
        return usersApi()
          .uploadStaffMemberProfilePicture(user?.id, user?.rawFile, PIC_OPTIONS)
          .then((result) => [result.data]);
      case WhoamiRoleEnum.ORGANIZER:
        return usersApi()
          .uploadOrganizerProfilePicture(user?.id, user?.rawFile, PIC_OPTIONS)
          .then((result) => [result.data]);
    }
  },
  delete: notImplemented,
};

export default profilePicProvider;
