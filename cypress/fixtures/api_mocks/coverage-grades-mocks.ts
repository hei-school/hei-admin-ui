import {
  GradeHistory,
  ImportGradeResult,
  Letter,
  LetterStatus,
  StudentGrade,
} from "@haapi-b0fc7615/typescript-client";
import {studentsMock} from "./students-mocks";

export const COVERAGE_EXAM_ID = "exam1_id";
export const GRADED_GRADE_ID = "coverage_grade_graded_id";

export const gradedStudentGradeMock: StudentGrade = {
  grade: {
    id: GRADED_GRADE_ID,
    score: 14,
    created_at: new Date("2025-04-02T08:37:09.000Z"),
    update_date: new Date("2025-04-03T08:37:09.000Z"),
  },
  student: studentsMock[0],
};

export const gradedWithoutIdStudentGradeMock: StudentGrade = {
  grade: {
    score: 9,
    created_at: new Date("2025-04-02T08:37:09.000Z"),
    update_date: new Date("2025-04-03T08:37:09.000Z"),
  },
  student: studentsMock[1],
};

export const ungradedStudentGradeMock: StudentGrade = {
  student: studentsMock[2],
};

export const examGradesCoverageMock: StudentGrade[] = [
  gradedStudentGradeMock,
  ungradedStudentGradeMock,
];

export const gradeHistoryMock: GradeHistory[] = [
  {
    created_at: new Date("2025-03-01T10:00:00.000Z"),
    score: 8,
    comment: "string",
  },
  {
    created_at: new Date("2025-05-01T10:00:00.000Z"),
    score: 14,
    comment: "Correction après réclamation",
  },
  {
    score: 5,
  },
];

export const importGradeResultWithErrorsMock: ImportGradeResult = {
  importGradeStats: {totalRows: 3, validRows: 1, invalidRows: 2},
  validGrades: [],
  invalidGrades: [
    {ref: "STD21001", score: 25, reason: "Note hors limite"},
    {ref: "STD21002", score: null, reason: "Étudiant introuvable"},
  ],
};

export const importGradeResultSuccessMock: ImportGradeResult = {
  importGradeStats: {totalRows: 2, validRows: 2, invalidRows: 0},
  validGrades: [],
  invalidGrades: [],
};

export const pendingLettersMock: Required<Letter>[] = [
  {
    id: "coverage_letter1_id",
    description: "Bordereau de paiement septembre",
    creation_datetime: new Date("2025-09-01T08:00:00Z"),
    approval_datetime: new Date("2025-09-02T08:00:00Z"),
    ref: "coverage_ref_1",
    status: LetterStatus.PENDING,
    file_url: "https://www.example.com/path/to/letter1.pdf",
    fee: {id: "fee1_id", comment: "Frais", amount: 0, type: "TUITION"},
    user: studentsMock[0],
    reason_for_refusal: "",
  },
  {
    id: "coverage_letter2_id",
    description: "Bordereau de paiement octobre",
    creation_datetime: new Date("2025-10-01T08:00:00Z"),
    approval_datetime: new Date("2025-10-02T08:00:00Z"),
    ref: "coverage_ref_2",
    status: LetterStatus.PENDING,
    file_url: "https://www.example.com/path/to/letter2.pdf",
    fee: {id: "fee2_id", comment: "Frais", amount: 0, type: "TUITION"},
    user: studentsMock[1],
    reason_for_refusal: "",
  },
  {
    id: "coverage_letter3_id",
    description: "Lettre déjà reçue",
    creation_datetime: new Date("2025-08-01T08:00:00Z"),
    approval_datetime: new Date("2025-08-02T08:00:00Z"),
    ref: "coverage_ref_3",
    status: LetterStatus.RECEIVED,
    file_url: "https://www.example.com/path/to/letter3.pdf",
    fee: {id: "fee3_id", comment: "Frais", amount: 0, type: "TUITION"},
    user: studentsMock[2],
    reason_for_refusal: "",
  },
];
