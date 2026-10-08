import {
  AttendanceStatus,
  EventLocation,
  EventType,
  StudentGlobalAttendance,
} from "@haapi-b0fc7615/typescript-client";

import {attendanceApi} from "./api";
import {HaDataProviderType, notImplemented} from "./HaDataProviderType";

interface StudentParticipationFilter {
  from: Date;
  to: Date;
  attendanceStatus?: AttendanceStatus;
  title?: string[];
}

interface StudentParticipationMeta {
  id: string;
}

type StudentParticipation = {
  id: string;
  attendanceStatus?: AttendanceStatus;
  beginDatetime?: Date;
  endDatetime?: Date;
  eventType?: EventType;
  eventTitle?: string;
  eventDescription?: string;
  location?: EventLocation;
};

const StudentParticipationProvider: HaDataProviderType<
  StudentParticipation,
  StudentParticipationFilter,
  StudentParticipationMeta
> = {
  getList: async (
    _page: number,
    _perPage: number,
    filter: StudentParticipationFilter,
    meta: StudentParticipationMeta
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
  getOne: notImplemented,
  saveOrUpdate: notImplemented,
  delete: notImplemented,
};

export default StudentParticipationProvider;
