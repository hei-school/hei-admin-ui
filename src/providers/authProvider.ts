import { ClientMetaData } from '@aws-amplify/auth/lib-esm/types'
import { Amplify } from 'aws-amplify'
import { Auth, CognitoUser } from '@aws-amplify/auth'
import awsExports from '../aws-exports'
import { Configuration, SecurityApi, Whoami } from '../gen/haClient'
import { AxiosResponse } from 'axios'

Amplify.configure(awsExports)

const authProvider = {
  // https://marmelab.com/react-admin/Authentication.html#anatomy-of-an-authprovider

  login: ({ username, password, clientMetadata }: Record<string, unknown>): Promise<CognitoUser | unknown> => {
    return Auth.signIn(username as string, password as string, clientMetadata as ClientMetaData).then(user => {
      const session = user.getSignInUserSession()
      if (!session) {
        localStorage.setItem('CognitoUser', JSON.stringify(user))
        Promise.resolve()
      } else {
        const conf = new Configuration()
        conf.accessToken = session.getIdToken().getJwtToken()
        const securityApi = new SecurityApi(conf)
        securityApi.whoami().then(response => {
          localStorage.setItem('ROLE', '' + response.data.role)
        })
        if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
        }
      }
    })
  },

  logout: async (): Promise<void> => {
    localStorage.clear()
    await Auth.signOut()
  },

  checkAuth: async (): Promise<void> => {
    if (localStorage.getItem('CognitoUser')) {
      Promise.resolve()
    } else {
      const session = await Auth.currentSession()
      if (session && session.getIdToken()) {
        return
      }
      throw new Error('Unauthorized')
    }
  },

  checkError: async (): Promise<void> => {
    Promise.resolve()
  },

  getIdentity: async (): Promise<string> => {
    if (localStorage.getItem('CognitoUser')) {
      return Promise.resolve('guest')
    } else {
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
    }
  },

  getUserInformations: async () => {
    if (localStorage.getItem('CognitoUser')) {
      Promise.resolve({ id: null, role: 'guest' })
    } else {
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
    }
  },

  getPermissions: async (): Promise<string[]> => {
    if (localStorage.getItem('CognitoUser')) {
      return Promise.resolve(['guest'])
    } else {
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
    }
  },

  getToken: async () => {
    if (localStorage.getItem('CognitoUser')) {
      Promise.resolve()
    } else {
    const session = await Auth.currentSession()
    return Promise.resolve(session.getIdToken().getJwtToken())
  }
}
}

export default authProvider
