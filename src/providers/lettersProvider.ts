import {lettersApi} from "./api";
import authProvider from "./authProvider";
import {HaDataProviderType} from "./HaDataProviderType";

const lettersProvider: HaDataProviderType = {
  getList: async (page, perPage, filter = {}) => {
    const {role} = authProvider.getCachedWhoami();
    const LETTER_TYPE: any = {
      PAYMENT_SLIP: true,
      ADMIN: false,
      ALL: null,
    };
    if (role === "MANAGER") {
      return lettersApi()
        .getStudentsLetters(
          page,
          perPage,
          filter.student_ref,
          filter.letter_ref,
          filter.status,
          filter.student_name,
          filter.fee_id,
          LETTER_TYPE[filter?.is_linked_with_fee]
        )
        .then((result) => ({data: result.data}));
    } else if (role === "ADMIN") {
      return lettersApi()
        .getLetters(
          page,
          perPage,
          filter.student_ref,
          filter.letter_ref,
          filter.status,
          filter.student_name,
          filter.fee_id,
          LETTER_TYPE[filter?.is_linked_with_fee],
          filter.role
        )
        .then((result) => ({data: result.data}));
    }
    return {data: []};
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
