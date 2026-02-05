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

const searchProvider: HaDataProviderType = {
  getList: async (_page, _perPage, filter: {word: string}) => {
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

  getOne: async () => {
    throw new Error("Not implemented");
  },

  saveOrUpdate: async () => {
    throw new Error("Not implemented");
  },

  delete: async () => {
    throw new Error("Not implemented");
  },
};

export default searchProvider;
