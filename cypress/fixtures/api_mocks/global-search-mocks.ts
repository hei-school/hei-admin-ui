import {EnableStatus} from "@haapi-b0fc7615/typescript-client";

export const globalSearchResultsMock = {
  students: [
    {
      id: "student1_id",
      ref: "STD21111",
      firstName: "John",
      lastName: "Doe",
      email: "test+ryan@hei.school",
      profilePicture: null,
      status: EnableStatus.ENABLED,
    },
    {
      id: "student2_id",
      ref: "STD00025",
      firstName: "Twenty",
      lastName: "Student",
      email: "test+twentyFive@hei.school",
      profilePicture: null,
      status: EnableStatus.SUSPENDED,
    },
  ],
  teachers: [
    {
      id: "teacher1_id",
      ref: "TCR21001",
      firstName: "Marc",
      lastName: "Dupont",
      email: "marc@dupont.com",
      profilePicture: null,
      status: EnableStatus.ENABLED,
    },
  ],
  organizer: [
    {
      id: "organizer1_id",
      ref: "ORG21001",
      firstName: "Olga",
      lastName: "Nizer",
      email: "olga@hei.school",
      avatar: null,
      status: EnableStatus.ENABLED,
    },
  ],
  monitor: [
    {
      id: "monitor1_id",
      ref: "MTR21001",
      firstName: "Mona",
      lastName: "Tor",
      email: "mona@hei.school",
      avatar: null,
      status: EnableStatus.DISABLED,
    },
  ],
  staff: [
    {
      id: "staff1_id",
      ref: "STF21001",
      firstName: "Stan",
      lastName: "Ffmember",
      email: "stan@hei.school",
      profilePicture: null,
      status: EnableStatus.ALUMNI,
    },
  ],
};

export const emptyGlobalSearchResultsMock = {
  students: [],
  teachers: [],
  organizer: [],
  monitor: [],
  staff: [],
};
