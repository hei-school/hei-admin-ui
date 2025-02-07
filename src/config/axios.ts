import Axios, {AxiosInstance} from "axios";

export const getAxiosInstance = (): AxiosInstance => {
  if ("axios" in window) return window.axios as AxiosInstance;
  (window as any).axios = Axios.create();
  return (window as any).axios;
};
