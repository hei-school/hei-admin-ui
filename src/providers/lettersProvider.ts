import {lettersApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const lettersProvider: HaDataProviderType = {
  getList: async (page, perPage, filter = {}) => {
    return lettersApi()
      .getLetters(
        page,
        perPage,
        filter.student_ref,
        filter.letter_ref,
        filter.status,
        filter.student_name,
        filter.fee_id,
        filter.is_linked_with_fee,
      )
      .then((result) => ({data: result.data}));
  },
  getOne: () => {
    throw new Error("Function not implemented.");
  },
  saveOrUpdate: () => {
    throw new Error("Function not implemented.");
  },
  delete: () => {
    throw new Error("Function not implemented.");
  },
};

export default lettersProvider;
