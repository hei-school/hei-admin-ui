import {EnableStatus, Exam, Sex} from "@haapi/typescript-client";
import {courseMocks} from "./course-mocks";
import {group1Mock} from "./groups-mocks";
import {teachersMock} from "./teachers-mocks";

export const examMocks: Exam[] = [
  {
    id: "exam1_id",
    coefficient: 1.5,
    title: "Introduction to Programming",
    examination_date: new Date("2025-05-10T08:08:00"),
    course_assignment: {
      id: "course_assignment1_id",
      main_teacher: {
        id: "teacher1_id",
        ref: "TCR21001",
        first_name: "John",
        last_name: "Doe",
        email: "john@doe.com",
        nic: "111111111111",
        sex: Sex.M,
        birth_date: "1985-03-15",
        birth_place: "New York",
        address: "123 Main St",
        phone: "+12025550123",
        entrance_datetime: new Date("2010-09-01"),
        coordinates: {
          longitude: -74.006,
          latitude: 40.7128,
        },
        high_school_origin: "Central High School",
        status: EnableStatus.ENABLED,
        profile_picture: "john_doe.jpg",
      },
      course: {
        id: "course1_id",
        code: "PROG101",
        name: "Introduction to Programming",
        credits: 3,
        total_hours: 45,
      },
      groups: [
        {
          id: "group1_id",
          name: "CS First Year",
          ref: "CS101",
          creation_datetime: new Date("2024-09-01"),
          size: 30,
          attributed_color: "blue",
        },
      ],
    },
  },
  {
    id: "exam2_id",
    coefficient: 2.0,
    title: "Database Fundamentals",
    examination_date: new Date("2025-05-15"),
    course_assignment: {
      id: "course_assignment2_id",
      main_teacher: {
        id: "teacher2_id",
        ref: "TCR21002",
        first_name: "Jane",
        last_name: "Smith",
        email: "jane@smith.com",
        nic: "222222222222",
        sex: Sex.F,
        birth_date: "1978-07-22",
        birth_place: "Boston",
        address: "456 Elm St",
        phone: "+12025550124",
        entrance_datetime: new Date("2005-08-15"),
        coordinates: {
          longitude: -71.0589,
          latitude: 42.3601,
        },
        high_school_origin: "Boston High School",
        status: EnableStatus.ENABLED,
        profile_picture: "jane_smith.jpg",
      },
      course: {
        id: "course2_id",
        code: "DB101",
        name: "Database Fundamentals",
        credits: 4,
        total_hours: 60,
      },
      groups: [
        {
          id: "group2_id",
          name: "CS Second Year",
          ref: "CS201",
          creation_datetime: new Date("2024-09-01"),
          size: 25,
          attributed_color: "red",
        },
      ],
    },
  },
  {
    id: "exam3_id",
    coefficient: 1.0,
    title: "Web Development Basics",
    examination_date: new Date("2025-05-20"),
    course_assignment: {
      id: "course_assignment3_id",
      main_teacher: {
        id: "teacher3_id",
        ref: "TCR21003",
        first_name: "Alice",
        last_name: "Johnson",
        email: "alice@johnson.com",
        nic: "333333333333",
        sex: Sex.F,
        birth_date: "1990-11-30",
        birth_place: "San Francisco",
        address: "789 Pine St",
        phone: "+12025550125",
        entrance_datetime: new Date("2015-07-01"),
        coordinates: {
          longitude: -122.4194,
          latitude: 37.7749,
        },
        high_school_origin: "SF High School",
        status: EnableStatus.ENABLED,
        profile_picture: "alice_johnson.jpg",
      },
      course: {
        id: "course3_id",
        code: "WEB101",
        name: "Web Development Basics",
        credits: 3,
        total_hours: 40,
      },
      groups: [
        {
          id: "group3_id",
          name: "CS Third Year",
          ref: "CS301",
          creation_datetime: new Date("2024-09-01"),
          size: 20,
          attributed_color: "green",
        },
      ],
    },
  },
];

export const gradesMocks = [
  {
    grade: {
      id: "151be181-9628-41c8-88c8-bd0537d20f40",
      exam: null,
      score: 13.5,
      created_at: "2025-04-02T08:37:09.069174Z",
      update_date: "2025-04-02T08:37:09.069174Z",
    },
    student: {
      specialization_field: "TN",
      professional_experience: null,
      work_study_status: "NOT_WORKING",
      commitment_begin_date: null,
      commitment_end_date: null,
      profile_picture: null,
      groups: [
        {
          id: "5c921a56-c513-4869-aee1-b6408f189e47",
          name: "Groupe d'élites",
          ref: "G12",
          creation_datetime: "2024-04-09T00:00:00Z",
          size: 7,
          attributed_color: "#46eb00",
        },
      ],
      is_repeating_year: false,
      id: "29510316-aee5-441d-bf94-4bd947020a1b",
      ref: "STD999999999",
      first_name: "Ilo",
      last_name: "rrrrr",
      email: "test@gmail.com",
      nic: null,
      sex: "F",
      birth_date: "1970-01-01",
      birth_place: null,
      address: null,
      phone: "1234567788",
      entrance_datetime: "2024-08-10T00:00:00Z",
      coordinates: {
        longitude: 0.0,
        latitude: 0.0,
      },
      high_school_origin: null,
      status: "SUSPENDED",
    },
  },
];

export const courseAssignmentMocks = [
  {
    id: "string",
    main_teacher: teachersMock[0],
    course: courseMocks[0],
    groups: [group1Mock],
  },
];
