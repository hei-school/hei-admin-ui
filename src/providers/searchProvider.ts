import {SearchResultsUser} from "@haapi-b0fc7615/typescript-client";
import {searchApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const EMPTY_BACKEND_RESPONSE: SearchResultsUser = {
  students: [],
  teachers: [],
  managers: [],
  organisers: [],
  monitors: [],
  staffMembers: [],
};

interface SearchFilter {
  word: string;
}

const searchProvider: HaDataProviderType<
  SearchResultsUser & {id: string},
  SearchFilter
> = {
  getList: async (_page, _perPage, filter: SearchFilter) => {
    const {word} = filter;
    const response = await searchApi().globalSearchUserGet(word);
    return {
      data: [
        {
          id: "global-search",
          ...(response?.data ?? EMPTY_BACKEND_RESPONSE),
        },
      ],
    };
  },
  getOne: () => {
    throw new Error("Not implemented");
  },
  saveOrUpdate: () => {
    throw new Error("Not implemented");
  },
  delete: () => {
    throw new Error("Not implemented");
  },
};

export default searchProvider;
