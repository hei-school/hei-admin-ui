export const studentGradeMocks: any = [
  {
    id: "1",
    main_teacher: {
      id: "1",
      ref: "T001",
      first_name: "John",
      last_name: "Doe",
    },
    course: {
      id: "1",
      code: "PROG1",
      name: "Algorithmics",
    },
    group: {
      id: "1",
      name: "Group A",
      ref: "G1",
    },
    exams: [
      {
        grade: {
          id: "1",
          score: 85,
        },
        student: {
          id: "1",
          ref: "STD000001",
          first_name: "Alice",
          last_name: "Smith",
          specialization_field: "COMMON_CORE",
        },
      },
    ],
  },
  {
    id: "2",
    main_teacher: {
      id: "2",
      ref: "T002",
      first_name: "Jane",
      last_name: "Smith",
    },
    course: {
      id: "2",
      code: "PROG2",
      name: "Data Structures",
    },
    group: {
      id: "2",
      name: "Group B",
      ref: "G2",
    },
    exams: [
      {
        grade: {
          id: "2",
          score: 90,
        },
        student: {
          id: "2",
          ref: "STD000002",
          first_name: "Bob",
          last_name: "Johnson",
          specialization_field: "COMMON_CORE",
        },
      },
    ],
  },
];
