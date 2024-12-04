import {WhoamiRoleEnum} from "@haapi/typescript-client";
import {HaDataProviderType} from "./HaDataProviderType";
import {usersApi} from "./api";
import {MULTIPART_HEADERS} from "./constants";

const PIC_OPTIONS = {
  headers: MULTIPART_HEADERS,
};

const profilePicProvider: HaDataProviderType = {
  async getList(_page: number, _perPage: number, _filter: any) {
    throw new Error("Function not implemented.");
  },
  async getOne(_id: string) {
    throw new Error("Function not implemented.");
  },
  async saveOrUpdate(payload: any) {
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
    }
  },
  async delete(_id: string) {
    throw new Error("Not implemented");
  },
};

export default profilePicProvider;
