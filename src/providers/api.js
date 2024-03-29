import {
  UsersApi,
  PayingApi,
  TeachingApi,
  FilesApi,
  CommentsApi,
  HealthApi,
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
