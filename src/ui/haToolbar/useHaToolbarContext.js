import {useContext} from "react";
import {HaToolbarContext} from "./FilterForm";

function useHaToolbarContext() {
  const {setCurrentFilter, currentFilter, setOneFilter} =
    useContext(HaToolbarContext);
  return {setCurrentFilter, currentFilter, setOneFilter};
}

export default useHaToolbarContext;
