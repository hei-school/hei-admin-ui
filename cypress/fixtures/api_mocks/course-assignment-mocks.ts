import {CourseAssignment, EnableStatus, Sex} from "@haapi/typescript-client";

export const CourseAssignmentMock: Required<CourseAssignment>[] = [
  {
    id: "string",
    main_teacher: {
      id: "teacher1_id",
      ref: "TCR21001",
      first_name: "Toky",
      last_name: "Teacher",
      sex: Sex.F,
      birth_date: "1990-01-01",
      address: "Adr 3",
      phone: "0322411125",
      email: "test+teacher1@hei.school",
      entrance_datetime: new Date("2021-10-08T08:27:24Z"),
      status: EnableStatus.ENABLED,
      nic: "234567890123",
      birth_place: "Antananarivo",
    },
    course: {
      id: "course_id1",
      name: "course_name1",
      code: "course_code1",
      credits: 5,
      total_hours: 5,
    },
    groups: [
      {
        id: "group_id1",
        name: "group_name1",
        ref: "group_ref1",
        size: 4,
        creation_datetime: new Date("2024-01-28"),
      },
    ],
  },
  {
    id: "string",
    main_teacher: {
      id: "teacher2_id",
      ref: "TCR21001",
      first_name: "Mayah",
      last_name: "Teacher",
      sex: Sex.F,
      birth_date: "1990-01-01",
      address: "Adr 3",
      phone: "0322411125",
      email: "test+teacher1@hei.school",
      entrance_datetime: new Date("2021-10-08T08:27:24Z"),
      status: EnableStatus.ENABLED,
      nic: "234567890123",
      birth_place: "Antananarivo",
    },
    course: {
      id: "course_id",
      name: "course_name2",
      code: "course_code2",
      credits: 6,
      total_hours: 6,
    },
    groups: [
      {
        id: "group_id2",
        name: "group_name2",
        ref: "group_ref2",
        size: 4,
        creation_datetime: new Date("2023-02-28"),
      },
    ],
  },
];

export const CourseAssignment1Mock = CourseAssignmentMock[0];

export const createCourseAssignment: CourseAssignment = {
  id: "string",
  main_teacher: {
    id: "teacher2_id",
    ref: "TCR21001",
    first_name: "Mayah",
    last_name: "Teacher",
    sex: Sex.F,
    birth_date: "1990-01-01",
    address: "Adr 3",
    phone: "0322411125",
    email: "test+teacher1@hei.school",
    entrance_datetime: new Date("2021-10-08T08:27:24Z"),
    status: EnableStatus.ENABLED,
    nic: "234567890123",
    birth_place: "Antananarivo",
  },
  course: {
    id: "course_id2",
    name: "course_name2",
    code: "course_code2",
    credits: 6,
    total_hours: 6,
  },
  groups: [
    {
      id: "group_id2",
      name: "group_name2",
      ref: "group_ref2",
      size: 4,
      creation_datetime: new Date("2023-02-28"),
    },
  ],
};
