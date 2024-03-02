import {
  EnableStatus,
  FeeStatusEnum,
  Sex,
  WhoamiRoleEnum,
} from "@haapi/typescript-client";
import {UNDEFINED} from "../../../utils/undefined";

export function getGenderInFr(sex) {
  switch (sex) {
    case Sex.M:
      return "Homme";
    case Sex.F:
      return "Femme";
    case null: // display empty_text if sex is null
      return UNDEFINED;
    default:
      throw new Error("Unknown gender");
  }
}

export const getUserStatusInFr = (status) => {
  switch (status) {
    case EnableStatus.ENABLED:
      return "Actif.ve";
    case EnableStatus.SUSPENDED:
      return "Suspendu·e";
    case EnableStatus.DISABLED:
      return "Quitté.e";
    default:
      throw new Error("Unknown user status");
  }
};

export function getFeesStatusInFr(status) {
  switch (status) {
    case FeeStatusEnum.LATE:
      return "En retard";
    case FeeStatusEnum.PAID:
      return "Payé";
    case FeeStatusEnum.UNPAID:
      return "En attente";
    default:
      throw new Error("Unknown fees status");
  }
}

export function getUserRoleInFr(userRole) {
  switch (userRole) {
    case WhoamiRoleEnum.MANAGER:
      return "Admin";
    case WhoamiRoleEnum.TEACHER:
      return "Enseignant(e)";
    case WhoamiRoleEnum.STUDENT:
      return "Étudiant(e)";
    default:
      throw new Error("Unknown user role");
  }
}
