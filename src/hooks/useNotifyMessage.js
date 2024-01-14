import { useNotify } from "react-admin";

export const useNotifyMessage= (message, config={}) => {
  const notify = useNotify();
  return ()=> notify(message, { autoHideDuration: 5000, ...config }); 
};
