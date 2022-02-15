import { UsersApi } from '../gen/haClient'
import authProvider from './authProvider'

export const usersApi = () => new UsersApi(authProvider.getCachedAuthConf())
