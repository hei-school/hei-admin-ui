import {lettersApi} from "./api";
import {HaDataProviderType, HaListResponseType} from "./HaDataProviderType";

const lettersProvider: HaDataProviderType = {
  getList: async (page: number, perPage: number) => {
    return lettersApi()
      .getLetters(page, perPage)
      .then(({data}) => ({data}) as HaListResponseType);
  },
  getOne: (): Promise<any> => {
    throw new Error("Function not implemented.");
  },
  saveOrUpdate: (): Promise<any> => {
    throw new Error("Function not implemented.");
  },
  delete: (): Promise<any> => {
    throw new Error("Function not implemented.");
  },
};

export default lettersProvider;
