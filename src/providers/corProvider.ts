import {corApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const corProvider: HaDataProviderType = {
  getList: async (page: number, perPage: number, filter: any) => {
    return corApi()
      .getCor(
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
  getOne: async () => {
    throw new Error("Function not implemented.");
  },
  saveOrUpdate: async () => {
    throw new Error("Function not implemented.");
  },
  delete: () => {
    throw new Error("Function not implemented.");
  },
};

export default corProvider;
