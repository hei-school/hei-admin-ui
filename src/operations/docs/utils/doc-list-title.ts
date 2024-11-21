import {FileType} from "@haapi/typescript-client";
import {OwnerType} from "../types";

export const getDocListTitle = (
  owner: keyof typeof OwnerType,
  type: FileType,
  userRef: string
) => {
  const mainTitle = getDocListTitleContent(owner, type);
  return mainTitle + (userRef ? ` de ${userRef}` : "");
};

const getDocListTitleContent = (
  owner: keyof typeof OwnerType,
  type: FileType
) => {
  if (owner === OwnerType.SCHOOL) {
    return "Liste des documents chez HEI";
  }

  if (owner === OwnerType.STUDENT) {
    switch (type) {
      case FileType.TRANSCRIPT:
        return "Liste des bulletins";
      case FileType.OTHER:
        return "Liste des autres documents étudiant";
      case FileType.WORK_DOCUMENT:
        return "Liste des validations d'expériences professionnelles";
      default:
        return "Liste des documents";
    }
  }
  return "Liste des documents";
};
