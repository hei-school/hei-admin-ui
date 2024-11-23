import {
  CreateAttendanceMovement,
  StudentAttendance,
} from "@haapi/typescript-client";

export const attendancesMock: StudentAttendance[] = [
  {
    id: "421427c5-0580-44ca-8ab3-3926664e53be",
    created_at: new Date("2024-10-21T05:30:17.232Z"),
    late_of: 0,
    place: "IVANDRY",
    is_late: false,
    course_session: {},
    student: {
      specialization_field: "COMMON_CORE",
      groups: [
        {
          id: "1519a032-39a0-48dd-825f-6717491a9e73",
          name: "Danger",
          ref: "jahkdkdkd",
          creation_datetime: new Date("2024-10-10T00:00:00Z"),
          size: 4,
        },
        {
          id: "5c921a56-c513-4869-aee1-b6408f189e47",
          name: "Groupe d'élite",
          ref: "G14",
          creation_datetime: new Date("2024-04-09T00:00:00Z"),
          size: 18,
        },
        {
          id: "e003a531-606d-43a7-ad26-6d253d6c5b39",
          name: "new",
          ref: "g52",
          creation_datetime: new Date("2024-10-09T18:40:19.825316Z"),
          size: 2,
        },
      ],
      is_repeating_year: false,
      id: "a2eeda5d-2950-45ad-8c22-d073c6bd1af3",
      ref: "NEW 445654",
      first_name: "Mayah",
      last_name: "Andriatsitohaina",
      email: "hei.mayah.3@gmail.col",
      sex: "F",
      coordinates: {
        longitude: 0.0,
        latitude: 0.0,
      },
      status: "SUSPENDED",
    },
  },
  {
    id: "2815ef7c-b3f3-42a8-bf17-7f6f4c926dbf",
    created_at: new Date("2024-10-22T11:46:11.560Z"),
    late_of: 0,
    place: "IVANDRY",
    is_late: false,
    student: {
      specialization_field: "COMMON_CORE",
      groups: [
        {
          id: "f8d611de-c00a-4575-98e9-efb2e0acb9fa",
          name: "grop",
          ref: "GROP",
          creation_datetime: new Date("2024-10-21T07:06:07.518817Z"),
          size: 3,
        },
      ],
      is_repeating_year: false,
      id: "933b85dc-bf6e-45b8-afc1-e6d981313c7a",
      ref: "HEI001",
      first_name: "test01",
      last_name: "filias",
      email: "john.doe@example.com",
      sex: "M",
      birth_date: "1970-01-01",
      coordinates: {
        longitude: 0.0,
        latitude: 0.0,
      },
      status: "ENABLED",
    },
  },
  {
    id: "b1b15d19-6b97-4cf2-8503-1e5987f3f161",
    created_at: new Date("2024-10-22T12:55:24.909Z"),
    late_of: 0,
    place: "IVANDRY",
    is_late: false,
    student: {
      specialization_field: "COMMON_CORE",
      groups: [
        {
          id: "f8d611de-c00a-4575-98e9-efb2e0acb9fa",
          name: "grop",
          ref: "GROP",
          creation_datetime: new Date("2024-10-21T07:06:07.518817Z"),
          size: 3,
        },
      ],
      is_repeating_year: false,
      id: "933b85dc-bf6e-45b8-afc1-e6d981313c7a",
      ref: "HEI001",
      first_name: "test01",
      last_name: "filias",
      email: "john.doe@example.com",
      sex: "M",
      birth_date: "1970-01-01",
      coordinates: {
        longitude: 0.0,
        latitude: 0.0,
      },
      status: "ENABLED",
    },
  },
  {
    id: "67984726-c4c4-47a7-b982-a9884be0cf59",
    created_at: new Date("2024-10-22T13:42:34.675Z"),
    late_of: 0,
    place: "IVANDRY",
    is_late: false,
    student: {
      groups: [],
      is_repeating_year: false,
      id: "f6d4787c-9b62-4783-8b75-e33644698c4a",
      ref: "HEI011",
      first_name: "test11",
      last_name: "fog",
      email: "charles.wilson@example.com",
      coordinates: {
        longitude: 0.0,
        latitude: 0.0,
      },
      status: "ENABLED",
    },
  },
];

export const createStudentsMock: CreateAttendanceMovement[] = [
  {
    student_id: "933b85dc-bf6e-45b8-afc1-e6d981313c7a",
    attendance_movement_type: "IN",
    created_at: new Date("2024-10-23T08:51:39.107Z"),
    place: "IVANDRY",
  },
  {
    student_id: "f6d4787c-9b62-4783-8b75-e33644698c4a",
    attendance_movement_type: "OUT",
    created_at: new Date("2024-10-23T10:00:00.000Z"),
    place: "ANDRAHARO",
  },
];
