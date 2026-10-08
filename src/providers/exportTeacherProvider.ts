import {usersApi} from "./api";
import {HaDataProviderType, notImplemented} from "./HaDataProviderType";
import {ExportedFile} from "./types";

const exportTeacherProvider: HaDataProviderType<ExportedFile> = {
  getList: notImplemented,

  getOne: async (id: string) => {
    return usersApi()
      .generateTeachersInXlsx({responseType: "arraybuffer"})
      .then((res) => ({id, file: res.data}));
  },

  saveOrUpdate: notImplemented,

  delete: notImplemented,
};

export default exportTeacherProvider;
