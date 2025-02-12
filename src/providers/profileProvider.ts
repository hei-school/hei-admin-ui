import {usersApi} from "@/providers/api";
import authProvider from "@/providers/authProvider";
import {HaDataProviderType} from "@/providers/HaDataProviderType";
import {WhoamiRoleEnum} from "@haapi/typescript-client";

const profileProvider: HaDataProviderType = {
  async getOne(id: string) {
    const role = authProvider.getCachedRole();

    switch (role) {
      case WhoamiRoleEnum.STUDENT:
        return usersApi()
          .getStudentById(id)
          .then((result) => result.data);
      case WhoamiRoleEnum.TEACHER:
        return usersApi()
          .getTeacherById(id)
          .then((result) => result.data);
      case WhoamiRoleEnum.MANAGER:
        return usersApi()
          .getManagerById(id)
          .then((result) => result.data);
      case WhoamiRoleEnum.MONITOR:
        return usersApi()
          .getMonitorById(id)
          .then((result) => result.data);
      case WhoamiRoleEnum.ADMIN:
        return usersApi()
          .getAdminById(id)
          .then((result) => result.data);
      case WhoamiRoleEnum.STAFF_MEMBER:
        return usersApi()
          .getStaffMemberById(id)
          .then((result) => result.data);
      case WhoamiRoleEnum.ORGANIZER:
        return usersApi()
          .getOrganizerById(id)
          .then((result) => result.data);
      default:
        throw new Error("Role non supporté");
    }
  },
  async getList() {
    throw new Error("Function not implemented");
  },
  async saveOrUpdate(payload) {
    const role = authProvider.getCachedRole();
    const id = payload[0].id;
    const profileData = payload[0];

    switch (role) {
      case WhoamiRoleEnum.STUDENT:
        return usersApi()
          .updateStudent(id, profileData)
          .then((result) => [result.data]);
      case WhoamiRoleEnum.TEACHER:
        return usersApi()
          .updateTeacher(id, profileData)
          .then((result) => [result.data]);
      case WhoamiRoleEnum.MANAGER:
        return usersApi()
          .updateManager(id, profileData)
          .then((result) => [result.data]);
      case WhoamiRoleEnum.ADMIN:
        return usersApi()
          .updateAdmin(id, profileData)
          .then((result) => [result.data]);
      case WhoamiRoleEnum.MONITOR:
        return usersApi()
          .updateMonitorById(id, profileData)
          .then((result) => [result.data]);
      case WhoamiRoleEnum.STAFF_MEMBER:
        return usersApi()
          .updateStaffMember(id, profileData)
          .then((result) => [result.data]);
      default:
        throw new Error("Role non supporté");
    }
  },
  async delete(_id: string) {
    throw new Error("Not implemented");
  },
};

export default profileProvider;
