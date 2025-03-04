import {
  confirmResetPassword,
  confirmSignIn,
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

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

const whoami = async (): Promise<Whoami> => {
  const conf = new Configuration();
  const token = sessionStorage.getItem("token") || "";
  conf.accessToken = token;
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
    try {
      await whoami();
      if (
        !sessionStorage.getItem(bearerItem) ||
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
