import {
  UsersApi,
  PayingApi,
  TeachingApi,
  FilesApi,
  CommentsApi,
  HealthApi,
  PromotionsApi,
  AnnouncementsApi,
  LettersApi,
  EventsApi,
  MonitoringApi,
} from "@haapi/typescript-client";
import authProvider from "./authProvider";
import {getAxiosInstance} from "@/config/axios";

const createApiInstance = (ApiClass) => {
  return new ApiClass(
    authProvider.getCachedAuthConf(),
    undefined,
    getAxiosInstance()
  );
};

export const usersApi = () => createApiInstance(UsersApi);
export const payingApi = () => createApiInstance(PayingApi);
export const teachingApi = () => createApiInstance(TeachingApi);
export const filesApi = () => createApiInstance(FilesApi);
export const commentApi = () => createApiInstance(CommentsApi);
export const healthApi = () => createApiInstance(HealthApi);
export const promotionApi = () => createApiInstance(PromotionsApi);
export const announcementsApi = () => createApiInstance(AnnouncementsApi);
export const lettersApi = () => createApiInstance(LettersApi);
export const eventsApi = () => createApiInstance(EventsApi);
export const monitoringApi = () => createApiInstance(MonitoringApi);
