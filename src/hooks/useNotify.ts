import {
  useNotify as useRaNotify,
  NotificationOptions,
  NotificationType,
} from "react-admin";

type UseNotifyOptions = NotificationOptions & {
  type?: NotificationType | undefined;
};

export const useNotify = () => {
  const notify = useRaNotify();
  return (message: string, config: UseNotifyOptions = {}) =>
    notify(message, {autoHideDuration: 5000, ...config});
};
