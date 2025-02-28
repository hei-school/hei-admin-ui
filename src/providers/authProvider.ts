import {
  confirmResetPassword,
  confirmSignIn,
  fetchAuthSession,
  resetPassword,
  signIn,
  signOut,
} from "@aws-amplify/auth";
import {Configuration, SecurityApi, Whoami} from "@haapi/typescript-client";
import {Amplify} from "aws-amplify";
import {AxiosResponse} from "axios";
import {getPermissions} from "../security/permissions";
import {awsConfig} from "./aws-config";

Amplify.configure(awsConfig);

const idItem = "ha_id";
const roleItem = "ha_role";
const bearerItem = "ha_bearer";
const paramIsTemporaryPassword = "t";
const paramUsername = "u";
const paramTemporaryPassword = "p";
const paramLocalAmplifyBoolean = "amplify-signin-with-hostedUI";

const whoami = async (): Promise<Whoami> => {
  const conf = new Configuration();
  const session = (await fetchAuthSession()) || {};
  conf.accessToken = session.tokens?.idToken?.toString();
  const securityApi = new SecurityApi(conf);
  return securityApi
    .whoami()
    .then((response: AxiosResponse<Whoami>) => response.data);
};

const cacheWhoami = (whoami: Whoami): void => {
  sessionStorage.setItem(idItem, whoami.id as string);
  sessionStorage.setItem(roleItem, whoami.role as string);
  sessionStorage.setItem(bearerItem, whoami.bearer as string);
};

const getCachedWhoami = () => ({
  id: sessionStorage.getItem(idItem),
  role: sessionStorage.getItem(roleItem),
  bearer: sessionStorage.getItem(bearerItem),
});

const getCachedRole = () => getCachedWhoami().role;

const getCachedAuthConf = (): Configuration => {
  const conf = new Configuration();
  conf.accessToken = sessionStorage.getItem(bearerItem) as string;
  return conf;
};

const authProvider = {
  // --------------------- ra functions -------------------------------------------
  // https://marmelab.com/react-admin/Authentication.html#anatomy-of-an-authprovider

  login: async ({
    username,
    password,
    clientMetadata,
  }: Record<string, unknown>): Promise<void> => {
    const user = await signIn({
      username: (username as string).trim(),
      password: password as string,
      options: {
        clientMetadata: clientMetadata as any,
      },
    });

    if (
      user.nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
    ) {
      const encodedUsername = encodeURIComponent(btoa(username as string));
      const encodedPassword = encodeURIComponent(btoa(password as string));
      window.location.replace(
        `/login?${paramIsTemporaryPassword}=true&${paramUsername}=${encodedUsername}&${paramTemporaryPassword}=${encodedPassword}`
      );

      return;
    }
    await whoami().then((whoami) => cacheWhoami(whoami));
  },

  logout: async (): Promise<void> => {
    await signOut();
    localStorage.clear(); // Amplify stores data in localStorage
    sessionStorage.clear();
  },

  checkAuth: async (): Promise<void> => {
    await whoami()
      .then(async (whoami) => {
        if (
          !sessionStorage.getItem(bearerItem) ||
          !localStorage.getItem(paramLocalAmplifyBoolean)
        ) {
          cacheWhoami(whoami);
        }
      })
      .catch((e) => {
        if (e.status === 405) {
          throw Promise.resolve();
        }

        throw new Error("Unauthorized");
      });
  },

  checkError: async () => Promise.resolve(),

  getIdentity: async () => await whoami(),

  getPermissions: async () =>
    Promise.resolve(getPermissions(getCachedRole() as string)),

  // --------------------- non-ra functions ----------------------------------------

  isTemporaryPassword: (): boolean => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(paramIsTemporaryPassword) === "true";
  },

  forgotPassword: async (username: string): Promise<void> => {
    await resetPassword({username});
  },
  forgotPasswordSubmit: async (
    username: string,
    code: string,
    newPassword: string
  ): Promise<void> => {
    await confirmResetPassword({
      username,
      confirmationCode: code,
      newPassword,
    });
  },
  setNewPassword: async (newPassword: string): Promise<void> => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const username = atob(
      decodeURIComponent(urlParams.get(paramUsername) as string)
    );
    const temporaryPassword = atob(
      decodeURIComponent(urlParams.get(paramTemporaryPassword) as string)
    );

    const signInResponse = await signIn({
      username,
      password: temporaryPassword,
    });
    if (
      signInResponse.nextStep?.signInStep ===
      "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
    ) {
      await confirmSignIn({
        challengeResponse: newPassword,
      });
      window.location.replace("/");
    }
  },

  whoami: whoami,

  getCachedWhoami: getCachedWhoami,
  getCachedRole: getCachedRole,
  getCachedAuthConf: getCachedAuthConf,
};

export default authProvider;
