import { UsersApi, PayingApi, AttendanceApi, TeachingApi } from '../gen/haClient'
import authProvider from './authProvider'

export const usersApi = () => new UsersApi(authProvider.getCachedAuthConf())
export const payingApi = () => new PayingApi(authProvider.getCachedAuthConf())
export const teachingApi = () => new TeachingApi(authProvider.getCachedAuthConf())
export const attendanceApi = () => new AttendanceApi(authProvider.getCachedAuthConf())
