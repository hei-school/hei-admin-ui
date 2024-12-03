import {lettersApi} from "@/providers/api";
import {HaDataProviderType} from "@/providers/HaDataProviderType";
import {toApiIds} from "./feeProvider";

type Params = {
  meta: {
    method: "CREATE" | "UPDATE";
    userId: string;
    feeId: string;
    feeAmount: number;
    eventParticipantId: string;
  };
};
const usersLettersProvider: HaDataProviderType = {
  getList: async (page, perPage, filter, meta) => {
    const {userId} = meta;
    const {status} = filter;

    return lettersApi()
      .getLettersByUserId(userId, page, perPage, status)
      .then((result) => ({data: result.data}));
  },
  getOne: async (id: string) => {
    return lettersApi()
      .getLetterById(id)
      .then((response) => response.data);
  },
  saveOrUpdate: async (payload: any, {meta}: Params) => {
    const {
      method,
      userId,
      feeId: raId,
      feeAmount,
      eventParticipantId,
    } = meta || {};

    const {feeId} = toApiIds(raId);

    if (method === "UPDATE") {
      return lettersApi()
        .updateLettersStatus(payload)
        .then((response) => response.data);
    }
    const {description, filename} = payload[0];
    const {title, rawFile} = filename;
    return lettersApi()
      .createLetter(
        userId,
        title,
        description,
        feeId,
        feeAmount,
        eventParticipantId,
        rawFile
      )
      .then((response) => [response.data]);
  },
  delete() {
    throw new Error("Not implemented");
  },
};

export default usersLettersProvider;
