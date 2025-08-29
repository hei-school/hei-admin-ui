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
    const {from, to, attendanceStatus} = filter;

    return attendanceApi()
      .getStudentAttendance(from, to, id, attendanceStatus)
      .then(({data}) => ({
        data: data.map((record: any, index: number) => ({
          ...record,
          id:
            record.id ||
            record._id ||
            `${record.beginDatetime || Date.now()}-${index}`,
        })),
      }));
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
