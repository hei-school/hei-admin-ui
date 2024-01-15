import {useNotify as _useNotify} from "react-admin";

export const useNotify = () => {
  const notify = _useNotify();
  return (message, config={}) => notify(message, {autoHideDuration: 5000, ...config});
};
