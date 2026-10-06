import {lettersApi} from "@/providers/api";
import {HaDataProviderType} from "@/providers/HaDataProviderType";
import {
  Letter,
  LetterStatus,
  UpdateLettersStatus,
} from "@haapi-b0fc7615/typescript-client";
import {toApiIds} from "./feeProvider";
import {LETTER_PER_PAGE} from "./lettersProvider";

interface UsersLettersFilter {
  status?: LetterStatus;
  eventId?: string;
}

interface UsersLettersMeta {
  userId: string;
}

type Params = {
  meta: {
    method: "CREATE" | "UPDATE";
    userId: string;
    feeId: string;
    feeAmount: number;
    eventParticipantId: string;
  };
};

// construit par CreateLetters : le fichier téléversé et son titre
interface LetterCreation {
  description: string;
  filename: {title: string; rawFile?: File};
}

type UsersLettersPayload = UpdateLettersStatus[] | [LetterCreation];

// seule la méthode transmise dans meta indique le payload : les nouveaux statuts
// de lettres existantes (UPDATE) ou une nouvelle lettre (CREATE)
const isStatusUpdatePayload = (
  _payload: UsersLettersPayload,
  method: Params["meta"]["method"]
): _payload is UpdateLettersStatus[] => method === "UPDATE";

const usersLettersProvider: HaDataProviderType<
  Letter,
  UsersLettersFilter,
  UsersLettersMeta,
  UsersLettersPayload,
  Params
> = {
  getList: async (page, perPage, filter, meta: UsersLettersMeta) => {
    const {userId} = meta;
    const {status, eventId} = filter;
    const pageSize = perPage || LETTER_PER_PAGE;
    return lettersApi()
      .getLettersByUserId(userId, eventId, page, pageSize, status)
      .then((result) => ({data: result.data}));
  },
  getOne: async (id: string) => {
    return lettersApi()
      .getLetterById(id)
      .then((response) => response.data);
  },
  saveOrUpdate: async (payload, {meta}: Params) => {
    const {
      method,
      userId,
      feeId: raId,
      feeAmount,
      eventParticipantId,
    } = meta || {};

    const {feeId} = toApiIds(raId);

    if (isStatusUpdatePayload(payload, method)) {
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
  delete: () => {
    throw new Error("Not implemented");
  },
};

export default usersLettersProvider;
