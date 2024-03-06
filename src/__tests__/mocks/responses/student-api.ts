import {
  Student,
  EnableStatus,
  Sex,
  Whoami,
  WhoamiRoleEnum,
  SpecializationField,
} from "@haapi/typescript-client";

export const studentNameToBeCheckedMock: string = "herilala";

export const student1Mock: Student = {
  id: "student1_id",
  ref: "STD21111",
  first_name: studentNameToBeCheckedMock,
  last_name: "Rafanomezantsoa",
  sex: Sex.M,
  birth_date: "2000-01-01",
  specialization_field: SpecializationField.COMMON_CORE,
  address: "Adr 1",
  phone: "0322411123",
  email: "test+ryan@hei.school",
  entrance_datetime: new Date("2021-11-08T08:25:24Z"),
  status: EnableStatus.ENABLED,
  nic: "123456789012",
  birth_place: "Antananarivo",
};

export const studentsMock: Student[] = [
  student1Mock,
  {
    id: "student2_id",
    ref: "STD00025",
    first_name: "Twenty",
    last_name: "Student",
    sex: Sex.M,
    birth_date: "2000-12-27",
    address: "lot 1245",
    phone: "+2613356894256",
    email: "test+twentyFive@hei.school",
    entrance_datetime: new Date("2023-01-19T12:00:00Z"),
    status: EnableStatus.ENABLED,
    nic: "123456789012",
    birth_place: "Antananarivo",
  },
  {
    id: "student3_id",
    ref: "STD123365",
    first_name: "John",
    last_name: "Johnny",
    sex: Sex.M,
    birth_date: "1992-02-12",
    address: "lot",
    phone: "0335689752",
    email: "mayahnyando@gmail.com",
    entrance_datetime: new Date("2021-05-12T09:50:00Z"),
    status: EnableStatus.ENABLED,
    nic: "345678901234",
    birth_place: "Antananarivo",
  },
  {
    id: "student4_id",
    ref: "STD 20002",
    first_name: "Old",
    last_name: "Student",
    sex: Sex.M,
    birth_date: "2005-02-02",
    address: "lot 12345",
    phone: "+261 33 26 523 56 ",
    email: "test+student45132165@hei.school",
    entrance_datetime: new Date("2022-01-20T07:00:00Z"),
    status: EnableStatus.ENABLED,
    nic: "456789012345",
    birth_place: "Antananarivo",
  },
  {
    id: "student5_id",
    ref: "STD21001",
    first_name: "Ryan",
    last_name: "Andria",
    sex: Sex.M,
    birth_date: "2000-01-01",
    address: "Adr 1",
    phone: "0322411123",
    email: "test+ryan@hei.school",
    entrance_datetime: new Date("2021-11-08T08:25:24Z"),
    status: EnableStatus.ENABLED,
    nic: "567890123456",
    birth_place: "Antananarivo",
  },
  {
    id: "student6_id",
    ref: "STD21002",
    first_name: "Two",
    last_name: "Student",
    sex: Sex.F,
    birth_date: "2000-01-02",
    address: "Adr 2",
    phone: "0322411124",
    email: "test+student2@hei.school",
    entrance_datetime: new Date("2021-11-09T08:26:24Z"),
    status: EnableStatus.ENABLED,
    nic: "678901234567",
    birth_place: "Antananarivo",
  },
  {
    id: "student7_id",
    ref: "STD21003",
    first_name: "quitzon",
    last_name: "Student",
    sex: Sex.F,
    birth_date: "2000-01-02",
    address: "Adr 2",
    phone: "0322411124",
    email: "test+student3@hei.school",
    entrance_datetime: new Date("2021-11-09T08:26:24Z"),
    status: EnableStatus.ENABLED,
    nic: "789012345678",
    birth_place: "Antananarivo",
  },
  {
    id: "student8_id",
    ref: "STD21004",
    first_name: "Test",
    last_name: "Three",
    sex: Sex.F,
    birth_date: "2014-02-07",
    address: "lot",
    phone: "+261 34 21 435 12",
    email: "Test@hei.school",
    entrance_datetime: new Date("2023-01-04"),
    status: EnableStatus.ENABLED,
    nic: "890123456789",
    birth_place: "Antananarivo",
  },
  {
    id: "student9_id",
    ref: "std2100552968687",
    first_name: "Check if it really works",
    last_name: "Student",
    sex: Sex.M,
    birth_date: "2022-12-30",
    address: "lot 5454f",
    phone: "+261335689741",
    email: "test+studen354651@gmail.com",
    entrance_datetime: new Date("2023-01-04"),
    status: EnableStatus.ENABLED,
    nic: "901234567890",
    birth_place: "Antananarivo",
  },
  {
    id: "student10_id",
    ref: "STD2103265",
    first_name: "For Test",
    last_name: "For Test",
    sex: Sex.M,
    birth_date: "2023-01-03",
    address: "lot 541215246546",
    phone: "0325689456",
    email: "test+student12665673@hei.school",
    entrance_datetime: new Date("2022-12-31"),
    status: EnableStatus.ENABLED,
    nic: "012345678901",
    birth_place: "Antananarivo",
  },
];

export const whoamiStudentMock: Whoami = {
  id: student1Mock.id,
  role: WhoamiRoleEnum.STUDENT,
  bearer: "bearer mock",
};

export const createStudent: Student = {
  ref: "STD000001",
  first_name: "string",
  last_name: "string",
  sex: Sex.F,
  specialization_field: SpecializationField.COMMON_CORE,
  birth_date: "2023-02-17",
  address: "Rue Dr Raseta Andraharo, Ambanja, Madagascar",
  phone: "+261 234 1779",
  email: "test+create+student@hei.school",
  entrance_datetime: new Date("2023-02-17"),
  status: EnableStatus.ENABLED,
  nic: "123456789012",
  birth_place: "Antananarivo",
  coordinates: {longitude: 1500, latitude: 1500},
};

export const liteCreatedStudent: Student = {
  ref: "STD000001",
  first_name: "string",
  last_name: "string",
  specialization_field: SpecializationField.COMMON_CORE,
  email: "test+create+student@hei.school",
  entrance_datetime: new Date("2023-02-17"),
  status: EnableStatus.ENABLED,
  nic: "123456789012",
  birth_place: "Antananarivo",
  coordinates: {longitude: 1500, latitude: 1500},
};

export const createdStudents: Student[] = [
  {
    id: "id1",
    ref: "STD000001",
    first_name: "John",
    last_name: "Smith",
    email: "userSTD000001@hei.school",
    sex: Sex.M,
    birth_date: "02-06-05",
    address: "address",
    phone: "236542132",
    entrance_datetime: new Date("2023-03-03"),
    status: EnableStatus.ENABLED,
    nic: "345678901234",
    birth_place: "Antananarivo",
  },
  {
    id: "id2",
    ref: "STD000002",
    first_name: "Patrick",
    last_name: "Smith",
    email: "userSTD000002@hei.school",
    sex: Sex.F,
    birth_date: "03-06-05",
    address: "address",
    phone: "236542132",
    entrance_datetime: new Date("2023-03-03"),
    status: EnableStatus.ENABLED,
    nic: "456789012345",
    birth_place: "Antananarivo",
  },
  {
    id: "id3",
    ref: "STD000003",
    first_name: "Jeanne",
    last_name: "Smith",
    email: "userSTD000003@hei.school",
    sex: Sex.M,
    birth_date: "04-06-05",
    address: "address",
    phone: "236542132",
    entrance_datetime: new Date("2023-03-03"),
    status: EnableStatus.ENABLED,
    nic: "567890123456",
    birth_place: "Antananarivo",
  },
  {
    id: "id4",
    ref: "STD000004",
    first_name: "Jean",
    last_name: "Smith",
    email: "userSTD000004@hei.school",
    sex: Sex.F,
    birth_date: "05-06-05",
    address: "address",
    phone: "236542132",
    entrance_datetime: new Date("2023-03-03"),
    status: EnableStatus.ENABLED,
    nic: "678901234567",
    birth_place: "Antananarivo",
  },
  {
    id: "id5",
    ref: "STD000005",
    first_name: "Pierre",
    last_name: "Smith",
    email: "userSTD000005@hei.school",
    sex: Sex.M,
    birth_date: "06-06-05",
    address: "address",
    phone: "236542132",
    entrance_datetime: new Date("2023-03-03"),
    status: EnableStatus.ENABLED,
    nic: "789012345678",
    birth_place: "Antananarivo",
  },
  {
    id: "id6",
    ref: "STD000006",
    first_name: "Hélène",
    last_name: "Smith",
    email: "userSTD000006@hei.school",
    sex: Sex.F,
    birth_date: "07-06-05",
    address: "address",
    phone: "236542132",
    entrance_datetime: new Date("2023-03-03"),
    status: EnableStatus.ENABLED,
    nic: "890123456789",
    birth_place: "Antananarivo",
  },
  {
    id: "id7",
    ref: "STD000007",
    first_name: "Patrice",
    last_name: "Smith",
    email: "userSTD000007@hei.school",
    sex: Sex.M,
    birth_date: "08-06-05",
    address: "address",
    phone: "236542132",
    entrance_datetime: new Date("2023-03-03"),
    status: EnableStatus.ENABLED,
    nic: "901234567890",
    birth_place: "Antananarivo",
  },
];

export const liteCreatedStudents: Student[] = [
  {
    id: "id1",
    ref: "STD000001",
    first_name: "John",
    last_name: "Smith",
    email: "userSTD000001@hei.school",
    entrance_datetime: new Date("2023-03-03"),
    status: EnableStatus.ENABLED,
    nic: "012345678901",
    birth_place: "Antananarivo",
  },
  {
    id: "id2",
    ref: "STD000002",
    first_name: "Patrick",
    last_name: "Smith",
    email: "userSTD000002@hei.school",
    entrance_datetime: new Date("2023-03-03"),
    status: EnableStatus.ENABLED,
    nic: "123456789012",
    birth_place: "Antananarivo",
  },
];
