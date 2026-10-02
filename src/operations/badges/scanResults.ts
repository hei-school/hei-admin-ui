import {useState} from "react";
import {getPublicStudent, httpStatusOf} from "./badgeApi";

export type ScanResult = {
  key: number;
  success: boolean;
  label: string;
  detail: string;
};

let resultKey = 0;

export const fullName = (student: {first_name?: string; last_name?: string}) =>
  `${student.last_name ?? ""} ${student.first_name ?? ""}`.trim();

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
