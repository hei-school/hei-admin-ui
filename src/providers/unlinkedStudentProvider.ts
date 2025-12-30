import {HaDataProviderType} from "./HaDataProviderType";
import {monitoringApi} from "./api";

const unlikedStudentProvider: HaDataProviderType = {
  getList: async (page: number, perPage: number) => {
    return monitoringApi()
      .getLinkStudentRequests(page, perPage)
      .then((response) => ({data: response.data}));
  },
  getOne: function (id: string, meta?: any): Promise<any> {
    throw new Error("Function not implemented.");
  },
  saveOrUpdate: (resources: any) => {
    throw new Error("Function not implemented.");
  },
  delete: function (id: string): Promise<any> {
    throw new Error("Function not implemented.");
  },
};

export default unlikedStudentProvider;
