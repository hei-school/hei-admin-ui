import {AttendanceStatus} from "@haapi-b0fc7615/typescript-client";

import {attendanceApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

type AttendanceRecord = {
  id?: string;
  _id?: string;
  attendance_status: AttendanceStatus;
  begin_datetime: string;
  end_datetime: string;
  event_type: string;
  title: string;
  description?: string;
  location?: string;
};

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
        data: data.map((record: AttendanceRecord, index: number) => ({
          id: record.id ?? record._id ?? `${record.begin_datetime}-${index}`,
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
