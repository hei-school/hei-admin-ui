import {lettersApi} from "./api";
import {HaDataProviderType, HaListResponseType} from "./HaDataProviderType";

const lettersProvider: HaDataProviderType = {
  getList: async (page: number, perPage: number) => {
    return lettersApi()
      .getLetters(page, perPage)
      .then(({data}) => ({data}) as HaListResponseType);
  },
  getOne: () => {
    throw new Error("Functi/providerson not implemented.");
  },
  saveOrUpdate: () => {
    throw new Error("Function not implemented.");
  },
  delete: () => {
    throw new Error("Function not implemented.");
  },
};

export default lettersProvider;
