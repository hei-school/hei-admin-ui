import {HaDataProviderType} from "./HaDataProviderType";
import { announcementsApi } from "./api";

const announcementrovider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    return [
      {
        "id": "string",
        "title": "string",
        "content": "string",
        "author": {
          "id": "string",
          "first_name": "string",
          "last_name": "string",
          "email": "string",
          "profile_picture": "string"
        },
        "creation_datetime": "2024-04-19T10:18:05.774Z",
        "scope": "GLOBAL"
      }
    ]
    return announcementsApi().getAnnouncements(page, perPage, filter.from, filter.to, filter.authorRef).then((result) => result.data);
  },
  async getOne(id: string) {
    throw new Error("Function not implemented.");
  },
  async saveOrUpdate(payload: any) {
    throw new Error("Function not implemented.");
  },
  async delete(id: string) {
    throw new Error("Not implemented");
  },
};

export default announcementrovider;