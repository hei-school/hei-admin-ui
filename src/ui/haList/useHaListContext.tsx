import {useContext} from "react";
import {HaListContext} from "./HaListTitle";

function useHaListContext() {
  return useContext(HaListContext);
}

export default useHaListContext;
