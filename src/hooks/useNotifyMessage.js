import {useState} from "react";
import { useNotify } from "react-admin";

export const useToggle = (message, config={}) => {
  const notify = useNotify();
  return ()=> notify(message, { autoHideDuration: 5000, ...config }); 
};
