import {SmsContactOwnerRole} from "@haapi-b0fc7615/typescript-client";

export const SMS_OWNER_ROLE_LABEL: Record<SmsContactOwnerRole, string> = {
  [SmsContactOwnerRole.ADMIN]: "Admin",
  [SmsContactOwnerRole.MANAGER]: "Manager",
  [SmsContactOwnerRole.MONITOR]: "Moniteur",
  [SmsContactOwnerRole.STUDENT]: "Étudiant",
  [SmsContactOwnerRole.TEACHER]: "Enseignant",
  [SmsContactOwnerRole.ORGANIZER]: "Organisateur",
  [SmsContactOwnerRole.STAFF_MEMBER]: "Staff",
};
