import {HaDataProviderType} from "./HaDataProviderType";
import {usersApi} from "./api";
import authProvider from "./authProvider";
import {WhoamiRoleEnum} from "@haapi/typescript-client";

const profilePicProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    throw new Error("Function not implemented.");
  },
  async getOne(id: string) {
    throw new Error("Function not implemented.");
  },
  async saveOrUpdate(payload: any) {
    const user = payload[0];

    switch (user?.role) {
      case WhoamiRoleEnum.STUDENT:
        return usersApi()
          .uploadStudentProfilePicture(user?.id, user?.rawFile)
          .then((result) => [result.data]);
      case WhoamiRoleEnum.TEACHER:
        return usersApi()
          .uploadTeacherProfilePicture(user?.id, user?.rawFile)
          .then((result) => [result.data]);
      case WhoamiRoleEnum.MANAGER:
        return usersApi()
          .uploadManagerProfilePicture(user?.id, user?.rawFile)
          .then((result) => [result.data]);
    }
  },
  async delete(id: string) {
    throw new Error("Not implemented");
  },
};

export default profilePicProvider;
