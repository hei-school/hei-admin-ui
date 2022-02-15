import { ClientMetaData } from '@aws-amplify/auth/lib-esm/types'
import { Amplify } from 'aws-amplify'
import { Auth } from '@aws-amplify/auth'
import awsExports from '../aws-exports'
import { Configuration, SecurityApi, Whoami } from '../gen/haClient'
import { AxiosResponse } from 'axios'

Amplify.configure(awsExports)

const isNewPasswordItem = 'isNewPassword'
const newPasswordItemIsSet = 'isNewPasswordItemSet'
const cognitoUsernameItem = 'cognitoUsername'
const cognitoOldPasswordItem = 'cognitoPassword'
const roleItem = 'role'
const bearerItem = 'bearer'

const whoami = async (): Promise<Whoami> => {
  const session = await Auth.currentSession()
  const conf = new Configuration()
  conf.accessToken = session.getIdToken().getJwtToken()
  const securityApi = new SecurityApi(conf)
  return securityApi
    .whoami()
    .then((response: AxiosResponse<Whoami>) => {
      return response.data
    })
    .catch(error => {
      console.error(error)
      return {}
    })
}

const cache = (whoami: Whoami): void => {
  sessionStorage.setItem(roleItem, whoami.role as string)
  sessionStorage.setItem(bearerItem, whoami.bearer as string)
}

const getCachedRole = () => sessionStorage.getItem(roleItem) as string

const getCachedAuthConf = (): Configuration => {
  const conf = new Configuration()
  conf.accessToken = sessionStorage.getItem(bearerItem) as string
  return conf
}

const authProvider = {
  // --------------------- ra functions -------------------------------------------
  // https://marmelab.com/react-admin/Authentication.html#anatomy-of-an-authprovider

  login: async ({ username, password, clientMetadata }: Record<string, unknown>): Promise<void> => {
    const user = await Auth.signIn(username as string, password as string, clientMetadata as ClientMetaData)
    if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
      sessionStorage.setItem(isNewPasswordItem, newPasswordItemIsSet)
      sessionStorage.setItem(cognitoUsernameItem, username as string)
      sessionStorage.setItem(cognitoOldPasswordItem, password as string)
      window.location.reload()
    }
  },

  logout: async (): Promise<void> => {
    localStorage.clear() // Amplify stores data in localStorage
    sessionStorage.clear()
    await Auth.signOut()
  },

  checkAuth: async (): Promise<void> => {
    const whoamiData = await whoami()
    if (whoamiData.id) {
      cache(whoamiData)
      return
    }
    throw new Error('Unauthorized')
  },

  checkError: async () => Promise.resolve(),

  getIdentity: async () => (await whoami()).id,

  getPermissions: async () => [(await whoami()).role],

  // --------------------- non-ra functions ----------------------------------------

  isNewPassword: (): boolean => {
    return sessionStorage.getItem(isNewPasswordItem) === newPasswordItemIsSet
  },

  setNewPassword: async (newPassword: string): Promise<void> => {
    const username = sessionStorage.getItem(cognitoUsernameItem) as string
    const oldPassword = sessionStorage.getItem(cognitoOldPasswordItem) as string
    const user = await Auth.signIn(username, oldPassword)
    Auth.completeNewPassword(user, newPassword)
    sessionStorage.clear()
    window.location.reload()
  },

  whoami: whoami,

  getCachedRole: getCachedRole,

  getCachedAuthConf: getCachedAuthConf
}

export default authProvider
