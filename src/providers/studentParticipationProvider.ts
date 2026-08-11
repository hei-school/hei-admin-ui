import {
  AttendanceStatus,
  StudentGlobalAttendance,
} from "@haapi-b0fc7615/typescript-client";

import {attendanceApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const StudentParticipationProvider: HaDataProviderType = {
  getList: async (
    _page: number,
    _perPage: number,
    filter: {
      from: Date;
      to: Date;
      attendanceStatus?: AttendanceStatus;
      title?: string[];
    },
    meta: {id: string}
  ) => {
    const {id} = meta;
    const {from, to, attendanceStatus, title} = filter;
    const titleParam = title && title.length > 0 ? title : [""];

    return attendanceApi()
      .getStudentAttendance(from, to, id, attendanceStatus, titleParam)
      .then(({data}) => ({
        data: data.map((record: StudentGlobalAttendance, index: number) => ({
          id: record.id ?? `${record.begin_datetime}-${index}`,
          attendanceStatus: record.attendance_status,
          beginDatetime: record.begin_datetime,
          endDatetime: record.end_datetime,
          eventType: record.event_type,
          eventTitle: record.title,
          eventDescription: record.description,
          location: record.location || undefined,
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
