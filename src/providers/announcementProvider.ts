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
    return {
      "id": "5f97891e-14ae-4eaf-bb28-ccb8a2db49c4",
      "title": "Title ",
      "content": "# HELLO\n\nMy name is **Mayah**",
      "author": {
          "id": "manager1_id",
          "first_name": "One",
          "last_name": "Manager",
          "email": "test+manager1@hei.school",
          "profile_picture": "https://preprod-bucket-haapi-bucket-1w9k0upi729sm.s3.eu-west-3.amazonaws.com/MANAGER/MGR21001/One.jpeg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHEaCWV1LXdlc3QtMyJGMEQCIB4FHXc8lSAAokAa3anGPHgAyrchDzlbw9f6YTU3HSoeAiByOQsffdTW%2BC%2FI77kP%2FAbPsMV5eSlzJTvzqjAMivQVhSrCAwi6%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDA1NzA0NTc4NTE4OSIMRQEkPFo9wrKo%2BKCtKpYDYIF0z%2B3PJZTzEXdIW8oQ2Tr%2Bh9sofIWRNuy1VF1D0kkVOJj0YzeyLjel5ezvnN09WUgIXHmQO5BuMATZKAtDVgt%2B1xXl7t8WQvTB0QBI0f4f4qXkFeLSLWPK00NVfOdlC8tQUyRlZJp5bQQT39CHVvVgkYF8F7B9fYzqdGJeSYJOwhfEWShLxHTJln%2BomJrCtw3wvahnsPIUf0ZzcWof4Dd%2FN63TavkO23lBTPs6Ots6UckEkBitCehF82kTX1Xh336x81lw%2FIOEISuqXPQV6Pfo%2B%2Buh1OFJtAwu9QKeAKUTS8COzRR8vBGEZYE2TbrKKu7aou9rfrL771VXxsiOqj6GHup%2B02pSTb8%2B2bKAo67WoZR8nLc2XA7FI4ZDUx4qwZXSWZEUjteXXJV%2F9zcMw2o8LsX9GGqhpSXYxSzsSkSi8e3dsmisFn%2Fqq5up5A5fKXz0ViTKEGlsp2zdgQveBw2Oas5JR9Onaq04OBu%2Fklm%2Bf0zVFMuexkW2fnoR5%2B6TosrSHALlDKGulb%2FrqWftt8ewXhmDUjCyz62xBjqfAXpc1IRbXAaQZYp61m2CCVDxbyanOJuWfcFUELvHRVbNqChW5y8YbW6gO43WK7lz852O7jaz3hD79iLMbVyOcGGpPKgxAveYtIi4BAT%2FeAaw6T5QhtZHtpemWIxBI2%2FFWugFsuE7hkTfnfElxy5V0bYPGGxqcmAgqIE%2BXwvnckTBzAPEhlgUogACconY4K9cKChTy%2Bla9r%2BBJbI5Hbthcw%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240426T083740Z&X-Amz-SignedHeaders=host&X-Amz-Credential=ASIAQ2SBRTJS7BDNSL7D%2F20240426%2Feu-west-3%2Fs3%2Faws4_request&X-Amz-Expires=84600&X-Amz-Signature=ff28c4177935d1c1709e589d4560fa2f0c9262fc81970d69af78c73ab4a6e6d2"
      },
      "creation_datetime": "2024-04-24T12:05:59.417195Z",
      "scope": "GLOBAL"
  }
  },
  async saveOrUpdate(payload: any) {
    return announcementsApi().createAnnouncement(payload[0]).then((result) => [result.data]);
  },
  async delete(id: string) {
    throw new Error("Not implemented");
  },
};

export default announcementProvider;
