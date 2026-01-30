import {useState} from "react";
import {useGetList} from "react-admin";
import {
  adaptSearchResultsUser,
  aggregateSearchResults,
  normalizeSearchResults,
} from "../utils/searchUtils";

export const useGlobalSearch = () => {
  const [searchValue, setSearchValue] = useState("");

  const {
    data = [],
    isLoading,
    isFetched,
  } = useGetList("searchs", {
    filter: {word: searchValue},
  });

  const normalizedResults = normalizeSearchResults(
    searchValue.trim() ? adaptSearchResultsUser(data[0]) : undefined
  );

  const users = aggregateSearchResults(normalizedResults);

  return {
    searchValue,
    setSearchValue,
    users,
    isLoading,
    isFetched,
  };
};
