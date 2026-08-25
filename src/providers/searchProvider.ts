import {SearchResultsUser} from "@haapi-3d601c85/typescript-client";
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
