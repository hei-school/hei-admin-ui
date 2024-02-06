import {usersApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";
import authProvider from "./authProvider";
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
    }
  },
};

export default profileProvider;
