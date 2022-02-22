import { ClientMetaData } from '@aws-amplify/auth/lib-esm/types'
import { Amplify } from 'aws-amplify'
import { Auth } from '@aws-amplify/auth'
import awsExports from '../aws-exports'
import { Configuration, SecurityApi, Whoami } from '../gen/haClient'
import { AxiosResponse } from 'axios'

Amplify.configure(awsExports)

const roleItem = 'role'
const bearerItem = 'bearer'
const paramIsTemporaryPassword = 't'
const paramUsername = 'u'
const paramTemporaryPassword = 'p'

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

const toBase64 = (param: string) => Buffer.from(param).toString('base64')

const fromBase64 = (param: string) => Buffer.from(param, 'base64').toString('ascii')

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
      const encodedUsername = encodeURIComponent(toBase64(username as string))
      const encodedPassword = encodeURIComponent(toBase64(password as string))
      window.location.replace(`/?${paramIsTemporaryPassword}=true&${paramUsername}=${encodedUsername}&${paramTemporaryPassword}=${encodedPassword}`)
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
    return urlParams.get(paramIsTemporaryPassword) === 'true'
  },

  setNewPassword: async (newPassword: string): Promise<void> => {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const username = fromBase64(decodeURIComponent(urlParams.get(paramUsername) as string)) as string
    const temporaryPassword = fromBase64(decodeURIComponent(urlParams.get(paramTemporaryPassword) as string)) as string
    const user = await Auth.signIn(username, temporaryPassword)
    await Auth.completeNewPassword(user, newPassword)
    window.location.replace('/')
  },

  whoami: whoami,

  getCachedRole: getCachedRole,

  getCachedAuthConf: getCachedAuthConf
}

export default authProvider
