import {
  EnableStatus,
  EventParticipant,
} from "@haapi-b0fc7615/typescript-client";
import {useState} from "react";
import {getPublicStudent, httpStatusOf} from "./badgeApi";

export type ScanResult = {
  key: number;
  success: boolean;
  label: string;
  detail: string;
  warning?: string;
};

export const SUSPENDED_WARNING =
  "Suspendu : frais en retard, passage au bureau requis.";

let resultKey = 0;

export const fullName = (student: {first_name?: string; last_name?: string}) =>
  `${student.last_name ?? ""} ${student.first_name ?? ""}`.trim();

// The student is marked present anyway: the warning only tells the teacher
// that he has overdue fees, so that he can send him to the office.
export const presentResult = (
  participant: EventParticipant
): Omit<ScanResult, "key"> => ({
  success: true,
  label: fullName(participant),
  detail: `${participant.ref ?? ""} · présent(e)`,
  warning:
    participant.student_status === EnableStatus.SUSPENDED
      ? SUSPENDED_WARNING
      : undefined,
});

export const useScanResults = () => {
  const [results, setResults] = useState<ScanResult[]>([]);
  const pushResult = (result: Omit<ScanResult, "key">) =>
    setResults((previous) =>
      [{...result, key: ++resultKey}, ...previous].slice(0, 20)
    );
  return {results, pushResult};
};

export const explainAttendanceError = async (
  publicId: string,
  error: unknown,
  notFoundDetail: string
): Promise<Omit<ScanResult, "key" | "success">> => {
  const status = httpStatusOf(error);
  if (status === 400) {
    return {
      label: "Badge non valable",
      detail: "Ce badge a été retiré ou son année universitaire est passée.",
    };
  }
  if (status === 404) {
    try {
      const student = await getPublicStudent(publicId);
      return {label: fullName(student), detail: notFoundDetail};
    } catch {
      return {label: "Badge inconnu", detail: "Ce badge n'existe pas."};
    }
  }
  if (status === 403) {
    return {label: "Accès refusé", detail: "Vous ne pouvez pas pointer."};
  }
  return {label: "Erreur", detail: "Réessayez de scanner le badge."};
};
