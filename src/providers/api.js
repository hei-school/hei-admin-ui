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
} from "@haapi/typescript-client";
import authProvider from "./authProvider";

export const usersApi = () => new UsersApi(authProvider.getCachedAuthConf());
export const payingApi = () => new PayingApi(authProvider.getCachedAuthConf());
export const commentApi = () =>
  new CommentsApi(authProvider.getCachedAuthConf());
export const teachingApi = () =>
  new TeachingApi(authProvider.getCachedAuthConf());
export const filesApi = () => new FilesApi(authProvider.getCachedAuthConf());
export const healthApi = () => new HealthApi(authProvider.getCachedAuthConf());
export const promotionApi = () =>
  new PromotionsApi(authProvider.getCachedAuthConf());
export const announcementsApi = () =>
  new AnnouncementsApi(authProvider.getCachedAuthConf());
export const lettersApi = () =>
  new LettersApi(authProvider.getCachedAuthConf());
export const eventsApi = () => new EventsApi(authProvider.getCachedAuthConf());
