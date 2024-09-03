import {lettersApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const lettersProvider: HaDataProviderType = {
  getList: async (page: number) => {
    return lettersApi()
      .getLetters(page, 6)
      .then((resposne) => resposne.data);
  },
  getOne: function (_id: string): Promise<any> {
    throw new Error("Function not implemented.");
  },
  saveOrUpdate: function (_id: string): Promise<any> {
    throw new Error("Function not implemented.");
  },
  delete: function (_id: string): Promise<any> {
    throw new Error("Function not implemented.");
  },
};

export default lettersProvider;
