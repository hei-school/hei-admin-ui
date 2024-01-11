import {UsersApi, PayingApi, TeachingApi} from "@haapi/typescript-client";
import authProvider from "./authProvider";

export const usersApi = () => new UsersApi(authProvider.getCachedAuthConf());
export const payingApi = () => new PayingApi(authProvider.getCachedAuthConf());
export const teachingApi = () =>
  new TeachingApi(authProvider.getCachedAuthConf());
