import { UsersApi, PayingApi, TeachingApi } from '../gen/haClient'
import authProvider from './authProvider'

export const usersApi = () => new UsersApi(authProvider.getCachedAuthConf())
export const payingApi = () => new PayingApi(authProvider.getCachedAuthConf())
export const teachingApi = () => new TeachingApi(authProvider.getCachedAuthConf())
