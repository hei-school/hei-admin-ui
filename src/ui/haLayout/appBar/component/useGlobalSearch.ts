import {useEffect, useState} from "react";
import {useGetList} from "react-admin";
import {
  adaptSearchResultsUser,
  aggregateSearchResults,
  normalizeSearchResults,
} from "../utils/searchUtils";

const SEARCH_DEBOUNCE_MS = 300;

export const useGlobalSearch = () => {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");

  useEffect(() => {
    const t = setTimeout(
      () => setDebouncedValue(searchValue),
      SEARCH_DEBOUNCE_MS
    );
    return () => clearTimeout(t);
  }, [searchValue]);

  const hasQuery = debouncedValue.trim().length > 0;

  const {
    data = [],
    isLoading,
    isFetched,
  } = useGetList(
    "searchs",
    {filter: {word: debouncedValue}},
    {enabled: hasQuery}
  );

  const normalizedResults = normalizeSearchResults(
    hasQuery ? adaptSearchResultsUser(data[0]) : undefined
  );

  const users = aggregateSearchResults(normalizedResults);

  const resetSearch = () => {
    setSearchValue("");
    setDebouncedValue("");
  };

  return {
    searchValue,
    setSearchValue,
    debouncedValue,
    resetSearch,
    users,
    isLoading: hasQuery && isLoading,
    isFetched,
  };
};
