import { ClientMetaData } from '@aws-amplify/auth/lib-esm/types'
import { Amplify } from 'aws-amplify'
import { Auth } from '@aws-amplify/auth'
import awsExports from '../aws-exports'
import { Configuration, SecurityApi, Whoami } from '../gen/haClient'
import { AxiosResponse } from 'axios'

Amplify.configure(awsExports)

const roleItem = 'role'
const bearerItem = 'bearer'
const isTemporaryPassword = 't'
const usernameUrl = 'u'
const temporaryPassword = 'p'

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

const cacheWhoami = (whoami: Whoami): void => {
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
      const encodedUsername = encodeURIComponent(Buffer.from(username as any).toString('base64'))
      const encodedPassword = encodeURIComponent(Buffer.from(password as any).toString('base64'))
      window.location.replace(`/?${isTemporaryPassword}=true&${usernameUrl}=${encodedUsername}&${temporaryPassword}=${encodedPassword}`)
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
      cacheWhoami(whoamiData)
      return
    }
    throw new Error('Unauthorized')
  },

  checkError: async () => Promise.resolve(),

  getIdentity: async () => (await whoami()).id,

  getPermissions: async () => [(await whoami()).role],

  // --------------------- non-ra functions ----------------------------------------

  isTemporaryPassword: (): boolean => {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    return urlParams.get(isTemporaryPassword) === 'true'
  },

  setNewPassword: async (newPassword: string): Promise<void> => {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const username = Buffer.from(decodeURIComponent(urlParams.get(usernameUrl) as string), 'base64').toString('ascii') as string
    const oldPassword = Buffer.from(decodeURIComponent(urlParams.get(temporaryPassword) as string), 'base64').toString('ascii') as string
    const user = await Auth.signIn(username, oldPassword)
    await Auth.completeNewPassword(user, newPassword)
    window.location.replace('/')
  },

  whoami: whoami,

  getCachedRole: getCachedRole,

  getCachedAuthConf: getCachedAuthConf
}

export default authProvider
