import Axios from "axios";

export const getAxiosInstance = () => {
  if ("axios" in window) return window.axios;
  window.axios = Axios.create();
  return window.axios;
};
