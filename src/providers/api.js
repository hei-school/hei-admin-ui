import { UsersApi, Configuration } from '../gen/haClient'
import authProvider from './authProvider'

const conf = new Configuration()
conf.accessToken = authProvider.getToken()
export const usersApi = new UsersApi(conf)
