import {
  UsersApi,
  PayingApi,
  TeachingApi,
  StudentsFileApi,
  FilesApi,
} from "@haapi/typescript-client";
import authProvider from "./authProvider";

export const usersApi = () => new UsersApi(authProvider.getCachedAuthConf());
export const payingApi = () => new PayingApi(authProvider.getCachedAuthConf());
export const teachingApi = () =>
  new TeachingApi(authProvider.getCachedAuthConf());
export const studenstFileApi = () =>
  new StudentsFileApi(authProvider.getCachedAuthConf());
export const filesApi = () => new FilesApi(authProvider.getCachedAuthConf());
