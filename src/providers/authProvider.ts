import {getAxiosInstance} from "@/config/axios";
import {
  confirmResetPassword,
  confirmSignIn,
  resetPassword,
  signIn,
  signOut,
} from "@aws-amplify/auth";
import {
  Configuration,
  SecurityApi,
  Whoami,
} from "@haapi-b0fc7615/typescript-client";
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

const WHOAMI_TTL_MS = 5 * 60 * 1000;
let pendingWhoami: Promise<Whoami> | null = null;
let lastWhoamiAt = 0;

const fetchWhoami = async (): Promise<Whoami> => {
  const securityApi = new SecurityApi(
    getCachedAuthConf(),
    undefined,
    getAxiosInstance()
  );
  return securityApi
    .whoami()
    .then((response: AxiosResponse<Whoami>) => response.data);
};

const whoami = async (): Promise<Whoami> => {
  if (pendingWhoami) return pendingWhoami;
  pendingWhoami = fetchWhoami();
  try {
    const result = await pendingWhoami;
    lastWhoamiAt = Date.now();
    return result;
  } finally {
    pendingWhoami = null;
  }
};

const isWhoamiFresh = (): boolean =>
  lastWhoamiAt !== 0 && Date.now() - lastWhoamiAt < WHOAMI_TTL_MS;

const cacheWhoami = (whoami: Partial<Whoami>): void => {
  if (whoami.id) sessionStorage.setItem(ID_ITEM, whoami.id);
  if (whoami.role) sessionStorage.setItem(ROLE_ITEM, whoami.role);
  if (whoami.bearer) sessionStorage.setItem(BEARER_ITEM, whoami.bearer);
};

const cacheBearer = (bearer: string): void => {
  sessionStorage.setItem(BEARER_ITEM, bearer);
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

const getErrorStatuses = (error: unknown): (number | undefined)[] => {
  const status = (error as {status?: number; response?: {status?: number}})
    ?.status;
  const responseStatus = (error as {response?: {status?: number}})?.response
    ?.status;
  return [status, responseStatus];
};

const isSessionInvalid = (error: unknown): boolean =>
  getErrorStatuses(error).some((s) => s === 401 || s === 403);

const isUnauthenticated = (error: unknown): boolean =>
  getErrorStatuses(error).some((s) => s === 401);

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
        clientMetadata: clientMetadata as Record<string, string> | undefined,
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
    lastWhoamiAt = 0;
    pendingWhoami = null;
    localStorage.clear();
    sessionStorage.clear();
  },

  checkAuth: async (): Promise<void> => {
    if (!getCachedWhoami().bearer) {
      throw new Error("Unauthorized - No cached token");
    }
    if (isWhoamiFresh()) return;
    try {
      cacheWhoami(await whoami());
    } catch (error) {
      if (isSessionInvalid(error)) {
        throw new Error("Unauthorized");
      }
      if (!getCachedWhoami().bearer) {
        throw new Error("Unauthorized - No cached token");
      }
      console.warn("whoami indisponible, session conservée :", error);
    }
  },

  checkError: async (error: unknown): Promise<void> => {
    if (!isUnauthenticated(error)) return;
    lastWhoamiAt = 0;
    throw new Error("Unauthorized");
  },

  getIdentity: async () => {
    const cached = getCachedWhoami();
    if (cached.id && cached.role) {
      return cached;
    }
    const identity = await whoami();
    cacheWhoami(identity);
    return identity;
  },

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
  cacheBearer: cacheBearer,
  getToken: getToken,
};

export default authProvider;
