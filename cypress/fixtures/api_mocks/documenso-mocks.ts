import {
  DocumensoDocument,
  DocumensoDocumentStatus,
  Promotion,
  StudentLevel,
  TemplateDocumenso,
} from "@haapi-b0fc7615/typescript-client";

export type DocumensoDocumentMock = DocumensoDocument & {
  archivedDatetime?: Date;
};

export const documensoTemplatesMock: TemplateDocumenso[] = [
  {
    id: "documenso_template_id1",
    documensoTemplateId: 1,
    title: "Fiche de suivi L1",
    type: "SUIVI",
    adminId: "admin1_id",
  },
  {
    id: "documenso_template_id2",
    documensoTemplateId: 2,
    title: "Fiche de suivi M1",
    type: "SUIVI",
    adminId: "admin1_id",
  },
];

export const templateL1Mock = documensoTemplatesMock[0];
export const templateM1Mock = documensoTemplatesMock[1];

export const documensoPromotionsMock: Required<Promotion>[] = [
  {
    id: "documenso_promotion_id1",
    ref: "PROM24001",
    name: "Promotion L1 2024",
    creation_datetime: new Date("2024-09-01T08:00:00Z"),
    groups: [],
    cycle: "BACHELOR",
    studentLevels: [StudentLevel.L1],
    cycle_level: "BACHELOR",
  },
  {
    id: "documenso_promotion_id2",
    ref: "PROM24002",
    name: "Promotion M1 2024",
    creation_datetime: new Date("2024-09-01T08:00:00Z"),
    groups: [],
    cycle: "MASTER",
    studentLevels: [StudentLevel.M1],
    cycle_level: "MASTER",
  },
];

export const promotionL1Mock = documensoPromotionsMock[0];
export const promotionM1Mock = documensoPromotionsMock[1];

export const pendingDocumentMock: DocumensoDocumentMock = {
  id: "documenso_document_id1",
  documensoDocumentId: 101,
  status: DocumensoDocumentStatus.PENDING,
  subjectId: "documenso_student_id1",
  subject: {
    id: "documenso_student_id1",
    ref: "STD24001",
    first_name: "Pending",
    last_name: "Student",
    email: "pending.student@hei.school",
  },
  level: StudentLevel.L1,
  templateId: templateL1Mock.id,
  templateTitle: templateL1Mock.title,
  generatedById: "admin1_id",
};

export const signedDocumentMock: DocumensoDocumentMock = {
  id: "documenso_document_id2",
  documensoDocumentId: 102,
  status: DocumensoDocumentStatus.COMPLETED,
  subjectId: "documenso_student_id2",
  subject: {
    id: "documenso_student_id2",
    ref: "STD24002",
    first_name: "Signed",
    last_name: "Student",
    email: "signed.student@hei.school",
  },
  level: StudentLevel.L1,
  templateId: templateL1Mock.id,
  templateTitle: templateL1Mock.title,
  completedDatetime: new Date("2025-01-15T10:00:00Z"),
  archivedDatetime: new Date("2025-01-16T09:30:00Z"),
  generatedById: "admin1_id",
};

export const rejectedDocumentMock: DocumensoDocumentMock = {
  id: "documenso_document_id3",
  documensoDocumentId: 103,
  status: DocumensoDocumentStatus.REJECTED,
  subjectId: "documenso_student_id3",
  subject: {
    id: "documenso_student_id3",
    ref: "STD24003",
    first_name: "Rejected",
    last_name: "Student",
    email: "rejected.student@hei.school",
  },
  level: StudentLevel.L1,
  templateId: templateL1Mock.id,
  templateTitle: templateL1Mock.title,
  generatedById: "admin1_id",
};

export const documensoDocumentsMock: DocumensoDocumentMock[] = [
  pendingDocumentMock,
  signedDocumentMock,
  rejectedDocumentMock,
];

export const otherTemplateDocumentMock: DocumensoDocumentMock = {
  ...pendingDocumentMock,
  id: "documenso_document_id4",
  documensoDocumentId: 104,
  subject: {
    id: "documenso_student_id4",
    ref: "STD24004",
    first_name: "Other",
    last_name: "Template",
    email: "other.template@hei.school",
  },
  templateId: templateM1Mock.id,
  templateTitle: templateM1Mock.title,
};

export const generationResultMock = {studentCount: 12};
export const signingTokenMock = {token: "documenso_signing_token_1"};
export const fileUrlMock = {
  fileUrl: "https://documenso.test/files/documenso_document_id2.pdf",
};
