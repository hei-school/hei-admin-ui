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
import axios, {AxiosResponse} from "axios";
import {getPermissions} from "../security/permissions";
import {awsConfig} from "./aws-config";

Amplify.configure(awsConfig);

const ID_ITEM = "ha_id";
const ROLE_ITEM = "ha_role";
const BEARER_ITEM = "ha_bearer";
const paramIsTemporaryKey = "t";
const paramUsername = "u";
const paramTemporaryKey = "p";
const paramLocalAmplifyBoolean = "amplify-signin-with-hostedUI";

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

const whoami = async (): Promise<Whoami> => {
  const conf = new Configuration();
  const token = sessionStorage.getItem(BEARER_ITEM) || "";
  conf.accessToken = token;
  const securityApi = new SecurityApi(conf);
  return securityApi
    .whoami()
    .then((response: AxiosResponse<Whoami>) => response.data);
};

const cacheWhoami = (whoami: Whoami): void => {
  sessionStorage.setItem(ID_ITEM, whoami.id as string);
  sessionStorage.setItem(ROLE_ITEM, whoami.role as string);
  sessionStorage.setItem(BEARER_ITEM, whoami.bearer as string);
};

const getCachedWhoami = () => ({
  id: sessionStorage.getItem(ID_ITEM),
  role: sessionStorage.getItem(ROLE_ITEM),
  bearer: sessionStorage.getItem(BEARER_ITEM),
});

const getCachedRole = () => getCachedWhoami().role;

const getCachedAuthConf = (): Configuration => {
  const conf = new Configuration();
  conf.accessToken = sessionStorage.getItem(BEARER_ITEM) as string;
  return conf;
};

// Fonction pour tenter une reconnexion via rafraîchissement du token
const attemptReconnectUser = async (): Promise<void> => {
  if (isRefreshing) {
    return refreshPromise!;
  }

  isRefreshing = true;
  refreshPromise = new Promise<void>(async (resolve, reject) => {
    try {
      const session = await fetchAuthSession({forceRefresh: true});
      if (!session.tokens?.idToken) {
        throw new Error("No valid token found after refresh");
      }
      const newWhoami = await whoami();
      cacheWhoami(newWhoami);
      resolve();
    } catch (error) {
      console.error("Token refresh failed:", error);
      sessionStorage.clear();
      localStorage.clear();
      reject(error);
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  });

  return refreshPromise;
};

const getToken = async (serverURL: string, code: string, state: string) => {
  try {
    const response = await axios.post(
      `${serverURL}authentication/signin`,
      null,
      {
        params: {code, state},
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching token:", error);
    throw error;
  }
};

const authProvider = {
  // --------------------- ra functions -------------------------------------------
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
        `/login?${paramIsTemporaryKey}=true&${paramUsername}=${encodedUsername}&${paramTemporaryKey}=${encodedPassword}`
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
    try {
      await whoami();
      if (
        !sessionStorage.getItem(BEARER_ITEM) ||
        !localStorage.getItem(paramLocalAmplifyBoolean)
      ) {
        const newWhoami = await whoami();
        cacheWhoami(newWhoami);
      }
    } catch (error: any) {
      if (error.status === 401 || !error.status) {
        const cachedWhoami = getCachedWhoami();
        if (cachedWhoami.bearer) {
          try {
            await attemptReconnectUser();
            return;
          } catch (refreshError) {
            throw new Error("Unauthorized after refresh attempt");
          }
        } else {
          throw new Error("Unauthorized - No cached token");
        }
      } else if (error.status === 405) {
        return Promise.resolve();
      } else {
        throw new Error("Unauthorized");
      }
    }
  },

  checkError: async () => Promise.resolve(),

  getIdentity: async () => await whoami(),

  getPermissions: async () =>
    Promise.resolve(getPermissions(getCachedRole() as string)),

  // --------------------- non-ra functions ----------------------------------------

  isTemporaryPassword: (): boolean => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(paramIsTemporaryKey) === "true";
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
      decodeURIComponent(urlParams.get(paramTemporaryKey) as string)
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
  cacheWhoami: cacheWhoami,
  getToken: getToken,
};

export default authProvider;
