import {groupsApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const exportGroupProvider: HaDataProviderType = {
  getList: () => {
    throw new Error("Function not implemented.");
  },

  getOne: async (id: string) => {
    return groupsApi()
      .generateStudentsGroupInXlsx(id, {responseType: "arraybuffer"})
      .then((res) => ({id, file: res.data}));
  },

  saveOrUpdate: () => {
    throw new Error("Function not implemented.");
  },

  delete: () => {
    throw new Error("Function not implemented.");
  },
};

export default exportGroupProvider;
