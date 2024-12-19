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

export const usersApi = () =>
  new UsersApi(authProvider.getCachedAuthConf(), undefined, getAxiosInstance());

export const payingApi = () =>
  new PayingApi(
    authProvider.getCachedAuthConf(),
    undefined,
    getAxiosInstance()
  );

export const teachingApi = () =>
  new TeachingApi(
    authProvider.getCachedAuthConf(),
    undefined,
    getAxiosInstance()
  );

export const filesApi = () =>
  new FilesApi(authProvider.getCachedAuthConf(), undefined, getAxiosInstance());

export const commentApi = () =>
  new CommentsApi(
    authProvider.getCachedAuthConf(),
    undefined,
    getAxiosInstance()
  );

export const healthApi = () =>
  new HealthApi(
    authProvider.getCachedAuthConf(),
    undefined,
    getAxiosInstance()
  );

export const promotionApi = () =>
  new PromotionsApi(
    authProvider.getCachedAuthConf(),
    undefined,
    getAxiosInstance()
  );

export const announcementsApi = () =>
  new AnnouncementsApi(
    authProvider.getCachedAuthConf(),
    undefined,
    getAxiosInstance()
  );

export const lettersApi = () =>
  new LettersApi(
    authProvider.getCachedAuthConf(),
    undefined,
    getAxiosInstance()
  );

export const eventsApi = () =>
  new EventsApi(
    authProvider.getCachedAuthConf(),
    undefined,
    getAxiosInstance()
  );

export const monitoringApi = () =>
  new MonitoringApi(
    authProvider.getCachedAuthConf(),
    undefined,
    getAxiosInstance()
  );
