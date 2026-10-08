import {usersApi} from "./api";
import {HaDataProviderType, notImplemented} from "./HaDataProviderType";
import {ExportedFile} from "./types";

const staffExportProvider: HaDataProviderType<ExportedFile> = {
  getList: notImplemented,
  getOne: async (id: string) => {
    return usersApi()
      .getStaffMembersIntoXlsx({responseType: "arraybuffer"})
      .then((res) => ({id, file: res.data}));
  },
  saveOrUpdate: notImplemented,
  delete: notImplemented,
};

export default staffExportProvider;
