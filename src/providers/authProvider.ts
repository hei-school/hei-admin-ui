import { ClientMetaData } from '@aws-amplify/auth/lib-esm/types'
import { Amplify } from 'aws-amplify'
import { Auth, CognitoUser } from '@aws-amplify/auth'
import awsExports from '../aws-exports'
import { Configuration, SecurityApi, Whoami } from '../haClient'
import { AxiosResponse } from 'axios'

Amplify.configure(awsExports)

const authProvider = {
  // https://marmelab.com/react-admin/Authentication.html#anatomy-of-an-authprovider

  login: ({ username, password, clientMetadata }: Record<string, unknown>): Promise<CognitoUser | unknown> => {
    return Auth.signIn(username as string, password as string, clientMetadata as ClientMetaData).then(user => {
      const session = user.getSignInUserSession()
      const conf = new Configuration()
      conf.accessToken = session.getIdToken().getJwtToken()
      const securityApi = new SecurityApi(conf)
      securityApi.whoami().then(response => {
        localStorage.setItem('role', '' + response.data.role)
      })
      if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
      }
    })
  },
  logout: async (): Promise<void> => {
    localStorage.clear()
    await Auth.signOut()
  },

  checkAuth: async (): Promise<void> => {
    const session = await Auth.currentSession()
    if (session && session.getIdToken()) {
      return
    }
    throw new Error('Unauthorized')
  },

  checkError: async (): Promise<void> => {
    Promise.resolve()
  },

  getIdentity: async (): Promise<string> => {
    const session = await Auth.currentSession()
    const conf = new Configuration()
    conf.accessToken = session.getIdToken().getJwtToken()
    const securityApi = new SecurityApi(conf)
    return securityApi
      .whoami()
      .then((whoami: AxiosResponse<Whoami>) => {
        return [whoami.data.id]
      })
      .catch((error: any) => {
        console.error(error)
        return error //TODO
      })
  },

  getUserInformations: async () => {
    const session = await Auth.currentSession()
    const conf = new Configuration()
    conf.accessToken = session.getIdToken().getJwtToken()
    const securityApi = new SecurityApi(conf)
    return securityApi
      .whoami()
      .then((whoami: AxiosResponse<Whoami>) => {
        return { id: whoami.data.id, role: whoami.data.role }
      })
      .catch((error: any) => {
        console.error(error)
        return error //TODO
      })
  },
  getPermissions: async (): Promise<string[]> => {
    const session = await Auth.currentSession()
    const conf = new Configuration()
    conf.accessToken = session.getIdToken().getJwtToken()
    const securityApi = new SecurityApi(conf)
    return securityApi
      .whoami()
      .then((whoami: AxiosResponse<Whoami>) => {
        return [whoami.data.role]
      })
      .catch((error: any) => {
        console.error(error)
        return error //TODO
      })
  },

  getToken: async () => {
    const session = await Auth.currentSession()
    return Promise.resolve(session.getIdToken().getJwtToken())
  }
}

export default authProvider
