import {useNotify as _useNotify} from "react-admin";

export const useNotify = (config = {}) => {
  const notify = _useNotify();
  return (message) => notify(message, {autoHideDuration: 5000, ...config});
};
