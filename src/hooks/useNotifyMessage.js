import {useNotify} from "react-admin";

export const useNotifyMessage = (config = {}) => {
  const notify = useNotify();
  return (message) => notify(message, {autoHideDuration: 5000, ...config});
};
