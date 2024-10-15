import {attendanceApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

type SelectFilter = {
  label: string;
  value: string;
};

const attendanceProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    const {courses_ids, teachers_ids} = filter;

    return attendanceApi()
      .getStudentsAttendance(
        page,
        perPage,
        courses_ids
          ? courses_ids.map((el: SelectFilter) => el.value)
          : undefined,
        teachers_ids
          ? teachers_ids.map((el: SelectFilter) => el.value)
          : undefined,
        filter.student_key_word,
        new Date("2021-08-07T07:30:00.00Z"),
        new Date("2021-11-09T07:30:00.00Z"),
        filter.attendance_statuses
      )
      .then((result) => ({data: result.data}));
  },
  async getOne(_id: string) {
    throw new Error("Function not implemented.");
  },
  async saveOrUpdate(payload: any) {
    return attendanceApi().createAttendanceMovement(payload);
  },
  delete(_id: string) {
    throw new Error("Function not implemented.");
  },
};

export default attendanceProvider;
