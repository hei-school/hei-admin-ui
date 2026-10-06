import {Scope} from "@haapi-b0fc7615/typescript-client";

// every scope has a label, the screens read them with a plain string
export const ANNOUNCEMENT_SCOPE: Record<string, string> = {
  GLOBAL: "Tout le monde",
  MANAGER: "Managers uniquement",
  STUDENT: "Étudiants uniquement",
  TEACHER: "Enseignants uniquement",
} satisfies Record<Scope, string>;
