import {Dispatch, SetStateAction, useContext} from "react";
import {HaToolbarContext} from "./FilterForm";

export type HaToolbarFilter = Record<string, unknown>;

export interface HaToolbarContextValue<TFilter extends HaToolbarFilter> {
  setCurrentFilter: Dispatch<SetStateAction<TFilter>>;
  currentFilter: TFilter;
  setOneFilter: <TSource extends keyof TFilter & string>(
    source: TSource,
    values: TFilter[TSource]
  ) => void;
}

// most filters (text, date) store a string, the others give their own shape
const useHaToolbarContext = <
  TFilter extends HaToolbarFilter = Record<string, string | undefined>,
>(): HaToolbarContextValue<TFilter> => {
  const {setCurrentFilter, currentFilter, setOneFilter} = useContext(
    HaToolbarContext
  ) as HaToolbarContextValue<TFilter>;
  return {setCurrentFilter, currentFilter, setOneFilter};
};

export default useHaToolbarContext;
