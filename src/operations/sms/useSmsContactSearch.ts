import {SmsContact} from "@haapi-b0fc7615/typescript-client";
import {useEffect, useState} from "react";
import {useGetList} from "react-admin";

export const MIN_SEARCH_LENGTH = 2;
const SEARCH_DEBOUNCE_MS = 300;

export const useSmsContactSearch = () => {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timeout = setTimeout(
      () => setSearch(searchInput),
      SEARCH_DEBOUNCE_MS
    );
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const canSearch = search.trim().length >= MIN_SEARCH_LENGTH;
  const {data: results = [], isFetching: isSearching} = useGetList(
    "sms-contacts",
    {filter: {search}, pagination: {page: 1, perPage: 20}},
    {enabled: canSearch}
  );

  return {
    searchInput,
    setSearchInput,
    results: results as SmsContact[],
    isSearching,
    canSearch,
  };
};
