import {RoleEnum} from "@haapi-3d601c85/typescript-client";
import {lettersApi} from "./api";
import authProvider from "./authProvider";
import {HaDataProviderType} from "./HaDataProviderType";

export const LETTER_PER_PAGE = 12;

const LetterFilter = {
  PAYMENT_SLIP: "PAYMENT_SLIP",
  ADMIN: "ADMIN",
  ALL: "ALL",
} as const;

type LetterFilterKey = keyof typeof LetterFilter;

const LETTER_TYPE: Record<LetterFilterKey, boolean | undefined> = {
  PAYMENT_SLIP: true,
  ADMIN: false,
  ALL: undefined,
};

const lettersProvider: HaDataProviderType = {
  getList: async (page, _perPage, filter = {}) => {
    const {role} = authProvider.getCachedWhoami();

    const linkedWithFee =
      LETTER_TYPE[(filter?.is_linked_with_fee as LetterFilterKey) ?? "ALL"];

    if (role === "MANAGER") {
      return lettersApi()
        .getStudentsLetters(
          page,
          LETTER_PER_PAGE,
          filter.student_ref,
          filter.letter_ref,
          filter.status,
          filter.student_name,
          filter.fee_id,
          linkedWithFee
        )
        .then((result) => ({data: result.data}));
    } else if (role === "ADMIN") {
      const roleFilter =
        filter.role !== undefined
          ? filter.role
          : [RoleEnum.STAFF_MEMBER, RoleEnum.TEACHER];

      return lettersApi()
        .getLetters(
          page,
          LETTER_PER_PAGE,
          filter.student_ref,
          filter.letter_ref,
          filter.status,
          filter.student_name,
          filter.fee_id,
          linkedWithFee,
          roleFilter
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
