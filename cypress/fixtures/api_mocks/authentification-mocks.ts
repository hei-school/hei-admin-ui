import {
  Admin,
  Manager,
  Monitor,
  Organizer,
  StaffMember,
  Student,
  Teacher,
  Whoami,
  WhoamiRoleEnum,
} from "@haapi/typescript-client";
import dotenv from "dotenv";

import {admin1Mock} from "./admins-mock";
import {manager1Mock} from "./managers-mocks";
import {monitor1Mock} from "./monitors-mock";
import {organizer1Mock} from "./organizers-mock";
import {staff1Mock} from "./staffs-mock";
import {student1Mock} from "./students-mocks";
import {teacher1Mock} from "./teachers-mocks";

dotenv.config();

export type UserConnected = {
  username: string;
  password: string;
  user: Student | Teacher | Manager | Monitor | Admin | StaffMember | Organizer;
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

export const getAdmin1Connected: () => UserConnected = () => {
  return {
    username: admin1Mock.email,
    password: Cypress.env("REACT_APP_TEST_ADMIN1_PASSWORD"),
    whoami: {
      role: WhoamiRoleEnum.ADMIN,
      id: admin1Mock.id!,
      bearer: "dymmy",
    },
    user: admin1Mock,
  };
};

export const getStaff1Connected: () => UserConnected = () => {
  return {
    username: staff1Mock.email,
    password: Cypress.env("REACT_APP_TEST_STAFF1_PASSWORD"),
    whoami: {
      role: WhoamiRoleEnum.STAFF_MEMBER,
      id: staff1Mock.id!,
      bearer: "dymmy",
    },
    user: staff1Mock,
  };
};

export const getOrganizer1Connected: () => UserConnected = () => {
  return {
    username: organizer1Mock.email,
    password: Cypress.env("REACT_APP_TEST_ORGANIZER1_PASSWORD"),
    whoami: {
      role: WhoamiRoleEnum.ORGANIZER,
      id: organizer1Mock.id!,
      bearer: "dymmy",
    },
    user: organizer1Mock,
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
    case "ADMIN":
      return getAdmin1Connected();
    case "STAFF_MEMBER":
      return getStaff1Connected();
    case "ORGANIZER":
      return getOrganizer1Connected();
    default:
      throw new Error("Unknown role");
  }
}
