import {Course} from "@haapi/typescript-client";

export const courseMocks: Required<Course>[] = [
  {
    id: "course_id1",
    name: "course_name1",
    code: "course_code1",
    credits: 5,
    level: "L1",
    total_hours: 5,
  },
  {
    id: "course_id2",
    name: "course_name2",
    code: "course_code2",
    level: "L2",
    credits: 6,
    total_hours: 6,
  },
  {
    id: "course_id3",
    name: "course_name3",
    code: "course_code3",
    credits: 7,
    level: "L3",
    total_hours: 7,
  },
];

export const courseMock1 = courseMocks[0];
