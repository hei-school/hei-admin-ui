import {getAxiosInstance} from "@/config/axios";
import {
  AnnouncementsApi,
  CommentsApi,
  CoursesApi,
  EventsApi,
  ExamsApi,
  FilesApi,
  GradesApi,
  GroupsApi,
  HealthApi,
  LettersApi,
  MonitoringApi,
  PayingApi,
  PromotionsApi,
  UsersApi,
} from "@haapi/typescript-client";
import authProvider from "./authProvider";

export const usersApi = () =>
  new UsersApi(authProvider.getCachedAuthConf(), undefined, getAxiosInstance());
export const payingApi = () =>
  new PayingApi(
    authProvider.getCachedAuthConf(),
    undefined,
    getAxiosInstance()
  );
export const commentApi = () =>
  new CommentsApi(
    authProvider.getCachedAuthConf(),
    undefined,
    getAxiosInstance()
  );
export const examApi = () =>
  new ExamsApi(authProvider.getCachedAuthConf(), undefined, getAxiosInstance());

export const gradesApi = () =>
  new GradesApi(
    authProvider.getCachedAuthConf(),
    undefined,
    getAxiosInstance()
  );

export const coursesApi = () =>
  new CoursesApi(
    authProvider.getCachedAuthConf(),
    undefined,
    getAxiosInstance()
  );
export const filesApi = () =>
  new FilesApi(authProvider.getCachedAuthConf(), undefined, getAxiosInstance());
export const healthApi = () =>
  new HealthApi(
    authProvider.getCachedAuthConf(),
    undefined,
    getAxiosInstance()
  );
export const groupsApi = () =>
  new GroupsApi(
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
