import {groupsApi} from "./api";
import {HaDataProviderType, notImplemented} from "./HaDataProviderType";
import {ExportedFile} from "./types";

const exportGroupProvider: HaDataProviderType<ExportedFile> = {
  getList: notImplemented,

  getOne: async (id: string) => {
    return groupsApi()
      .generateStudentsGroupInXlsx(id, {responseType: "arraybuffer"})
      .then((res) => ({id, file: res.data}));
  },

  saveOrUpdate: notImplemented,

  delete: notImplemented,
};

export default exportGroupProvider;
