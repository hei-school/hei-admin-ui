import {
  Manager,
  Monitor,
  Student,
  Teacher,
  Whoami,
  WhoamiRoleEnum,
} from "@haapi/typescript-client";
import dotenv from "dotenv";

import {manager1Mock} from "./managers-mocks";
import {monitor1Mock} from "./monitors-mock";
import {student1Mock} from "./students-mocks";
import {teacher1Mock} from "./teachers-mocks";

dotenv.config();

export type UserConnected = {
  username: string;
  password: string;
  user: Student | Teacher | Manager | Monitor;
  whoami: Whoami;
};

export const getStudent1Connected: () => UserConnected = () => {
  return {
    username: student1Mock.email,
    password: Cypress.env("REACT_APP_TEST_STUDENT1_PASSWORD"),
    whoami: {
      role: WhoamiRoleEnum.STUDENT,
      id: student1Mock.id!,
      bearer: "dymmy",
    },
    user: student1Mock,
  };
};

export const getTeacher1Connected: () => UserConnected = () => {
  return {
    username: teacher1Mock.email,
    password: Cypress.env("REACT_APP_TEST_TEACHER1_PASSWORD"),
    whoami: {
      role: WhoamiRoleEnum.TEACHER,
      id: teacher1Mock.id!,
      bearer: "dymmy",
    },
    user: teacher1Mock,
  };
};

export const getManager1Connected: () => UserConnected = () => {
  return {
    username: manager1Mock.email,
    password: Cypress.env("REACT_APP_TEST_MANAGER1_PASSWORD"),
    whoami: {
      role: WhoamiRoleEnum.MANAGER,
      id: manager1Mock.id!,
      bearer: "dymmy",
    },
    user: manager1Mock,
  };
};

export const getMonitor1Connected: () => UserConnected = () => {
  return {
    username: monitor1Mock.email,
    password: Cypress.env("REACT_APP_TEST_MONITOR1_PASSWORD"),
    whoami: {
      role: WhoamiRoleEnum.MONITOR,
      id: monitor1Mock.id!,
      bearer: "dymmy",
    },
    user: monitor1Mock,
  };
};

export function getUserConnected(role: WhoamiRoleEnum) {
  switch (role) {
    case "STUDENT":
      return getStudent1Connected();
    case "TEACHER":
      return getTeacher1Connected();
    case "MANAGER":
      return getManager1Connected();
    case "MONITOR":
      return getMonitor1Connected();
    default:
      throw new Error("Unknown role");
  }
}
