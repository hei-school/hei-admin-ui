export const examMocks: any = [
  {
    id: "1",
    coefficient: 1.5,
    title: "ARITHMETIQUE DES MACHINES",
    examination_date: "2025-02-01T08:30:00Z",
    awarded_course: {
      id: 1,
      main_teacher: {
        id: 1,
        ref: "TCR21001",
        first_name: "John",
        last_name: "Doe",
      },
      course: {
        id: "1",
        code: "THEORIE1",
        name: "Mathematics",
      },
      group: {
        id: "1",
        name: "Math Enthusiasts",
        ref: "G1",
      },
    },
  },
  {
    id: "2",
    coefficient: 2.0,
    title: "ALGORITHME AVEC NODEJS",
    examination_date: "2025-02-15T10:00:00Z",
    awarded_course: {
      id: "2",
      main_teacher: {
        id: "2",
        ref: "TCR21002",
        first_name: "Jane",
        last_name: "Smith",
      },
      course: {
        id: "2",
        code: "PROG1",
        name: "Algorithme",
      },
      group: {
        id: "2",
        name: "Hacker",
        ref: "G2",
      },
    },
  },
];
