import {useCallback, useEffect, useState} from "react";
import {stringifyObj} from "../utils/stringify";

export type UseTabManagerArgs = {
  defaultTabIndex?: number;
  values: string[];
  tabParamName?: string;
};

export const useTabManager = ({
  defaultTabIndex = 0,
  tabParamName = "tab",
  values,
}: UseTabManagerArgs) => {
  const [tabIndex, setTabIndex] = useState(defaultTabIndex);
  const stringifiedValues = stringifyObj(values);

  const getTabIndexFromURL = useCallback(() => {
    const params = new URLSearchParams(location.search);
    const tabParamValue = params.get(tabParamName);
    const tabParamIndex = values.indexOf(tabParamValue!);
    return tabParamIndex === -1 ? defaultTabIndex : tabParamIndex;
  }, [location.search, tabParamName, defaultTabIndex, stringifiedValues]);

  const updateURLWithTab = useCallback(
    (newIndex: number) => {
      const searchParams = new URLSearchParams();
      const newTabValue = values[newIndex];

      if (!newTabValue) {
        return;
      }

      searchParams.set(tabParamName, newTabValue);
      const newURL = `${location.pathname}?${searchParams.toString()}`;
      window.history.pushState({}, "", newURL);
    },
    [location, stringifiedValues]
  );

  const handleTabChange = (newIndex: number) => {
    setTabIndex(newIndex);
    updateURLWithTab(newIndex);
  };

  useEffect(() => {
    setTabIndex(getTabIndexFromURL());
  }, [getTabIndexFromURL, setTabIndex]);

  return {
    tabIndex,
    setTabIndex,
    handleTabChange,
  };
};
