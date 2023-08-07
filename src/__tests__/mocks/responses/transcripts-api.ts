import { StudentTranscriptClaim, StudentTranscriptClaimStatusEnum, StudentTranscriptVersion, Transcript, TranscriptSemesterEnum } from "src/gen/haClient";

export const transcript1Mock: Transcript = {
    id: 'transcript1_id',
    student_id: 'student1_id',
    creation_datetime: '2022-10-08T08:27:24Z',
    semester: TranscriptSemesterEnum.S1,
    is_definitive: false,
    academic_year: 2023
}

export const transcript2Mock: Transcript = {
    id: 'transcript2_id',
    student_id: 'student1_id',
    creation_datetime: '2022-11-08T08:27:24Z',
    semester: TranscriptSemesterEnum.S2,
    is_definitive: true,
    academic_year: 2023
}

export const transcriptsMock: Transcript[] = [
    transcript1Mock, transcript2Mock
]

export const transcriptsVersion1Mock: StudentTranscriptVersion = {
    id: 'transcriptVersion1_id',
    transcript_id: 'transcript1_id',
    ref: 1,
    created_by_user_id: 'manager1_id',
    created_by_user_role: 'MANAGER',
    creation_datetime: "2023-08-07T10:53:47.265Z"
}

export const transcriptsVersion2Mock: StudentTranscriptVersion = {
    id: 'transcriptVersion2_id',
    transcript_id: 'transcript1_id',
    ref: 2,
    created_by_user_id: 'manager1_id',
    created_by_user_role: 'MANAGER',
    creation_datetime: "2023-08-07T10:53:47.265Z"
}

export const transcriptsVersionMock: StudentTranscriptVersion[] = [
    transcriptsVersion1Mock, transcriptsVersion2Mock
]

export const claims1Mock: StudentTranscriptClaim = {
    id: 'claims1_id',
    transcript_id: 'transcript1_id',
    transcript_version_id: 'transcriptVersion1_id',
    status: StudentTranscriptClaimStatusEnum.Open,
    creation_datetime: '2023-08-07T10:59:12.358Z',
    closed_datetime: '2023-09-07T10:59:12.358Z',
    reason: 'Les notes PROG2 manquent de 2 points'
}

export const claims2Mock: StudentTranscriptClaim = {
    id: 'claims2_id',
    transcript_id: 'transcript1_id',
    transcript_version_id: 'transcriptVersion2_id',
    status: StudentTranscriptClaimStatusEnum.Open,
    creation_datetime: '2023-09-07T10:59:12.358Z',
    closed_datetime: '2023-10-07T10:59:12.358Z',
    reason: 'Les notes de WEB2 manquent de 5 points'
}

export const claimsMock: StudentTranscriptClaim[] = [
    claims1Mock, claims2Mock
]