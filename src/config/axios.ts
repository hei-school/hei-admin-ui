import Axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

// Le backend throttle les rafales de lectures : une page de liste declenche une
// dizaine de GET en parallele et une partie revient en 429. Ces 429 sont
// transitoires, on les rejoue avec un backoff exponentiel + jitter au lieu de
// les remonter a react-admin comme une erreur.
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 400;
const MAX_DELAY_MS = 8_000;

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  __retryCount?: number;
};

const statusOf = (error: AxiosError): number | undefined =>
  error.response?.status ?? error.status;

// Uniquement les lectures : rejouer un POST / PUT / DELETE risquerait de
// dupliquer une ecriture.
const isRetriableRead = (error: AxiosError): boolean => {
  const method = (error.config?.method ?? "get").toUpperCase();
  if (method !== "GET" && method !== "HEAD") return false;
  if (statusOf(error) === 429) return true;
  // Un preflight OPTIONS throttle (429) est invisible depuis JS : le navigateur
  // remonte une erreur reseau sans reponse. Ce cas se rejoue aussi.
  return !error.response && error.code === AxiosError.ERR_NETWORK;
};

const retryDelayMs = (error: AxiosError, attempt: number): number => {
  const retryAfter = error.response?.headers?.["retry-after"];
  if (retryAfter !== undefined && retryAfter !== null) {
    const seconds = Number(retryAfter);
    if (Number.isFinite(seconds) && seconds >= 0) {
      return Math.min(seconds * 1000, MAX_DELAY_MS);
    }
    const at = Date.parse(String(retryAfter));
    if (!Number.isNaN(at)) {
      return Math.min(Math.max(0, at - Date.now()), MAX_DELAY_MS);
    }
  }
  const backoff = BASE_DELAY_MS * 2 ** (attempt - 1);
  return Math.min(backoff, MAX_DELAY_MS) + Math.random() * 250;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const withRetryOn429 = (instance: AxiosInstance): AxiosInstance => {
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const config = error.config as RetriableRequestConfig | undefined;
      if (!config || !isRetriableRead(error)) throw error;

      const attempt = (config.__retryCount ?? 0) + 1;
      if (attempt > MAX_RETRIES) throw error;
      config.__retryCount = attempt;

      await wait(retryDelayMs(error, attempt));
      return instance.request(config);
    }
  );
  return instance;
};

export const getAxiosInstance = (): AxiosInstance => {
  if ("axios" in window) return window.axios as AxiosInstance;
  (window as any).axios = withRetryOn429(Axios.create());
  return (window as any).axios;
};
