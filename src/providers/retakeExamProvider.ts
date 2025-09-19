// retakeExamProvider.mock.ts

import {HaDataProviderType} from "./HaDataProviderType";
// import { retakeExamApi } from "./api"; // 🔗 vrai API (désactivé ici)

export type RetakeExam = {
  id: string;
  course: {
    id: string;
    level: string;
    code: string;
    name: string;
    credits: number;
    total_hours: number;
  };
  session: {
    id: string;
    title: string;
    date_from: string;
    date_to: string;
  };
  student_id: string;
};

let mockRetakeExams: RetakeExam[] = [
  {
    id: "retake-001",
    course: {
      id: "course-101",
      level: "L1",
      code: "MATH101",
      name: "Analyse 1",
      credits: 6,
      total_hours: 60,
    },
    session: {
      id: "session-2025-1",
      title: "Session de rattrapage Septembre 2025",
      date_from: "2025-09-20T08:00:00Z",
      date_to: "2025-09-25T17:00:00Z",
    },
    student_id: "STD3393443586",
  },
  {
    id: "retake-002",
    course: {
      id: "course-202",
      level: "L2",
      code: "PHY201",
      name: "Physique Générale",
      credits: 5,
      total_hours: 45,
    },
    session: {
      id: "session-2025-1",
      title: "Session de rattrapage Septembre 2025",
      date_from: "2025-09-20T08:00:00Z",
      date_to: "2025-09-25T17:00:00Z",
    },
    student_id: "STD3393443586",
  },
  {
    id: "retake-003",
    course: {
      id: "course-203",
      level: "L1",
      code: "Prog2",
      name: "POO",
      credits: 8,
      total_hours: 50,
    },
    session: {
      id: "session-2025-1",
      title: "Session de rattrapage Septembre 2025",
      date_from: "2025-09-20T08:00:00Z",
      date_to: "2025-09-25T17:00:00Z",
    },
    student_id: "STD3393443586",
  },
  {
    id: "retake-004",
    course: {
      id: "course-208",
      level: "L1",
      code: "Sec1",
      name: "POO",
      credits: 8,
      total_hours: 50,
    },
    session: {
      id: "session-2025-1",
      title: "Session de rattrapage Septembre 2025",
      date_from: "2025-09-20T08:00:00Z",
      date_to: "2025-09-25T17:00:00Z",
    },
    student_id: "STD3393443586",
  },
  {
    id: "retake-005",
    course: {
      id: "course-20",
      level: "L1",
      code: "Sys2",
      name: "POO",
      credits: 8,
      total_hours: 50,
    },
    session: {
      id: "session-2025-1",
      title: "Session de rattrapage Septembre 2025",
      date_from: "2025-09-20T08:00:00Z",
      date_to: "2025-09-25T17:00:00Z",
    },
    student_id: "STD3393443586",
  },
  {
    id: "retake-006",
    course: {
      id: "course-3",
      level: "L1",
      code: "Sys1",
      name: "POO",
      credits: 8,
      total_hours: 50,
    },
    session: {
      id: "session-2025-1",
      title: "Session de rattrapage Septembre 2025",
      date_from: "2025-09-20T08:00:00Z",
      date_to: "2025-09-25T17:00:00Z",
    },
    student_id: "STD3393443586",
  },
  {
    id: "retake-007",
    course: {
      id: "course-23",
      level: "L1",
      code: "Pro1",
      name: "POO",
      credits: 8,
      total_hours: 50,
    },
    session: {
      id: "session-2025-1",
      title: "Session de rattrapage Septembre 2025",
      date_from: "2025-09-20T08:00:00Z",
      date_to: "2025-09-25T17:00:00Z",
    },
    student_id: "STD3393443586",
  },
  {
    id: "retake-008",
    course: {
      id: "course-213",
      level: "L1",
      code: "Pro2",
      name: "POO",
      credits: 8,
      total_hours: 50,
    },
    session: {
      id: "session-2025-1",
      title: "Session de rattrapage Septembre 2025",
      date_from: "2025-09-20T08:00:00Z",
      date_to: "2025-09-25T17:00:00Z",
    },
    student_id: "STD3393443586",
  },
  {
    id: "retake-009",
    course: {
      id: "course-253",
      level: "L1",
      code: "Mgt2",
      name: "POO",
      credits: 8,
      total_hours: 50,
    },
    session: {
      id: "session-2025-1",
      title: "Session de rattrapage Septembre 2025",
      date_from: "2025-09-20T08:00:00Z",
      date_to: "2025-09-25T17:00:00Z",
    },
    student_id: "STD3393443586",
  },
  {
    id: "retake-010",
    course: {
      id: "course-23",
      level: "L1",
      code: "Mgt1",
      name: "POO",
      credits: 8,
      total_hours: 50,
    },
    session: {
      id: "session-2025-1",
      title: "Session de rattrapage Septembre 2025",
      date_from: "2025-09-20T08:00:00Z",
      date_to: "2025-09-25T17:00:00Z",
    },
    student_id: "STD3393443586",
  },
];

const retakeExamProvider: HaDataProviderType = {
  getList: async (_page, _perPage, _filter, meta = {}) => {
    console.log("tes");
    const {studentId, sessionId} = meta;
    console.log(meta);
    if (!studentId || !sessionId) {
      throw new Error("studentId et sessionId sont requis dans meta");
    }

    const data = mockRetakeExams.filter(
      (exam) => exam.student_id === studentId && exam.session.id === sessionId
    );

    return {data};

    // return retakeExamApi()
    //   .getStudentRetakeExamBySession(studentId, sessionId)
    //   .then((response) => ({
    //     data: response.data,
    //     total: response.data.length,
    //   }));
  },

  getOne: async (id, _meta) => {
    const found = mockRetakeExams.find((exam) => exam.id === id);
    if (!found) throw new Error("Retake exam not found");
    return {data: found};

    // return retakeExamApi().getOneRetakeExam(id).then((response) => ({
    //   data: response.data,
    // }));
  },

  saveOrUpdate: async (payloads: any, _meta) => {
    const exams = Array.isArray(payloads) ? payloads : [payloads];
    const sessionId = exams[0].session_id;

    if (!sessionId) {
      throw new Error("session_id est requis dans payload");
    }

    const created: RetakeExam[] = exams.map((exam) => ({
      id: `retake-${Math.floor(Math.random() * 10000)}`,
      course: {
        id: exam.course_id,
        level: exam.level ?? "L1",
        code: exam.course_code ?? "MOCK101",
        name: exam.course_name ?? "Mock Course",
        credits: exam.credits ?? 6,
        total_hours: exam.total_hours ?? 60,
      },
      session: {
        id: sessionId,
        title: exam.session_title ?? "Mock Session",
        date_from: exam.date_from ?? new Date().toISOString(),
        date_to:
          exam.date_to ??
          new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
      },
      student_id: exam.student_id,
    }));

    mockRetakeExams = [...mockRetakeExams, ...created];
    return {data: created};

    // return retakeExamApi()
    //   .createOrUpdateRetakeExam(sessionId, exams)
    //   .then((response) => ({ data: response.data }));
  },

  delete: async (id: string) => {
    return Error("Function not implemented");
  },
};

export default retakeExamProvider;
