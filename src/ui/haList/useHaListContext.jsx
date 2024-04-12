import { useContext } from "react";
import { HaListContext } from "./HaListTitle";

function useHaListContext() {
  const { closeAction } = useContext(HaListContext);
  return { closeAction };
}

export default useHaListContext;
