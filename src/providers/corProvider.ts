import {CorStatus, CrupdateCor} from "@haapi-b0fc7615/typescript-client";
import {corApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const corProvider: HaDataProviderType = {
  getList: async (
    page: number,
    perPage: number,
    filter: {
      page: number;
      perPage: number;
      from: Date;
      to: Date;
      student_ref?: string;
      group_ref?: string[];
      cor_status?: CorStatus[];
    }
  ) => {
    return corApi()
      .getCors(
        page,
        perPage,
        filter.from,
        filter.to,
        filter.student_ref,
        filter.group_ref,
        filter.cor_status
      )
      .then((response) => ({data: response.data}));
  },
  getOne: async (id: string) => {
    return corApi()
      .getCorById(id)
      .then((response) => response.data);
  },

  saveOrUpdate: async (payload: CrupdateCor[]) => {
    const {concerned_student_id} = payload[0];
    return corApi()
      .crupdateStudentCors(concerned_student_id!, payload[0])
      .then((response) => [response.data]);
  },
  delete: () => {
    throw new Error("Function not implemented.");
  },
};

export default corProvider;
