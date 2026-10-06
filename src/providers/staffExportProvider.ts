import {usersApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";
import {ExportedFile} from "./types";

const staffExportProvider: HaDataProviderType<ExportedFile> = {
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
