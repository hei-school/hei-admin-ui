import { ClientMetaData } from '@aws-amplify/auth/lib-esm/types'

import { Amplify } from 'aws-amplify'
import { Auth, CognitoUser } from '@aws-amplify/auth'
import awsExports from '../aws-exports'

import { Configuration, SecurityApi, Whoami } from '../haClient'
import { AxiosResponse } from 'axios'

Amplify.configure(awsExports)

class AuthProvider {
  // https://marmelab.com/react-admin/Authentication.html#anatomy-of-an-authprovider

  public login = ({ username, password, clientMetadata }: Record<string, unknown>): Promise<CognitoUser | unknown> => {
    return Auth.signIn(username as string, password as string, clientMetadata as ClientMetaData)
  }

  public logout = async (): Promise<void> => {
    Auth.signOut()
  }

  public checkAuth = async (): Promise<void> => {
    const session = await Auth.currentSession()
    if (session && session.getIdToken()) {
      return
    }
    throw new Error('Unauthorized')
  }

  public checkError = async (): Promise<void> => {
    Promise.resolve()
  }

  public getIdentity = async (): Promise<string> => {
    const session = await Auth.currentSession()
    const idToken = session.getIdToken()
    return Promise.resolve(idToken.decodePayload().id)
  }

  public getPermissions = async (): Promise<string[]> => {
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
}

export default new AuthProvider()
