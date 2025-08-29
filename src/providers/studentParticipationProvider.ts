import {attendanceApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const StudentParticipationProvider: HaDataProviderType = {
  getList: async (
    _page: number,
    _perPage: number,
    filter = {},
    meta: Record<string, any> = {}
  ) => {
    const {id} = meta;
    const {from, to} = filter;

    return attendanceApi()
      .getStudentAttendance(from, to, id)
      .then(({data}) => ({data}));
  },
  getOne: () => {
    throw new Error("Not implemented");
  },
  saveOrUpdate: () => {
    throw new Error("Not implemented");
  },
  delete: () => {
    throw new Error("Not implemented");
  },
};

export default StudentParticipationProvider;
