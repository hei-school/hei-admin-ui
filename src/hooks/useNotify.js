import { useNotify as useRaNotify } from "react-admin";

export const useNotify = () => {
  const notify = useRaNotify();
  return (message, config = {}) =>
    notify(message, { autoHideDuration: 5000, ...config });
};
