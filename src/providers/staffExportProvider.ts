import {usersApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const staffExportProvider: HaDataProviderType = {
  getList: () => {
    throw new Error("Function not implemented.");
  },
  getOne: async (id: string) => {
    return usersApi()
      .getStaffMembersIntoXlsx({responseType: "arraybuffer"})
      .then((res) => ({id, file: res.data}));
  },
  saveOrUpdate: () => {
    throw new Error("Function not implemented.");
  },
  delete: () => {
    throw new Error("Function not implemented.");
  },
};

export default staffExportProvider;
