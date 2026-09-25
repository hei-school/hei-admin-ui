import {
  SmsContactOwnerRole,
  SmsRecipientSource,
} from "@haapi-b0fc7615/typescript-client";

export const SMS_OWNER_ROLE_LABEL: Record<SmsContactOwnerRole, string> = {
  [SmsContactOwnerRole.ADMIN]: "Admin",
  [SmsContactOwnerRole.MANAGER]: "Manager",
  [SmsContactOwnerRole.MONITOR]: "Moniteur",
  [SmsContactOwnerRole.STUDENT]: "Étudiant",
  [SmsContactOwnerRole.TEACHER]: "Enseignant",
  [SmsContactOwnerRole.ORGANIZER]: "Organisateur",
  [SmsContactOwnerRole.STAFF_MEMBER]: "Staff",
};

export const SMS_RECIPIENT_SOURCE_LABEL: Record<SmsRecipientSource, string> = {
  [SmsRecipientSource.CONTACT_GROUP]: "Groupe de contacts",
  [SmsRecipientSource.MANUAL_SELECTION]: "Contact sélectionné",
  [SmsRecipientSource.MANUAL_NUMBER]: "Numéro manuel",
  [SmsRecipientSource.IMPORTED_FILE]: "Fichier importé",
};
