import {
  EnableStatus,
  FeeStatusEnum,
  Sex,
  WhoamiRoleEnum,
} from "@haapi/typescript-client";
import {NOT_DEFINED} from "../../../utils/constants";

export function getGenderInFr(sex) {
  switch (sex) {
    case Sex.M:
      return "Homme";
    case Sex.F:
      return "Femme";
    case null: // display empty_text if sex is null
      return NOT_DEFINED;
    default:
      throw new Error("Unknown gender");
  }
}

export const getUserStatusInFr = (status, sex) => {
  const isWoman = sex === Sex.F;
  switch (status) {
    case EnableStatus.ENABLED:
      return isWoman ? "Active" : "Actif";
    case EnableStatus.SUSPENDED:
      return isWoman ? "Suspendue" : "Suspendu";
    case EnableStatus.DISABLED:
      return isWoman ? "Quittée" : "Quitté";
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

export function getUserRoleInFr(userRole, sex) {
  const isWoman = sex === Sex.F;
  switch (userRole) {
    case WhoamiRoleEnum.ADMIN:
      return "Admin";
    case WhoamiRoleEnum.MANAGER:
      return "Manager";
    case WhoamiRoleEnum.TEACHER:
      return isWoman ? "Enseignante" : "Enseignant";
    case WhoamiRoleEnum.STUDENT:
      return isWoman ? "Étudiante" : "Étudiant";
    case WhoamiRoleEnum.MONITOR:
      return isWoman ? "Monitrice" : "Moniteur";
    default:
      throw new Error("Unknown user role");
  }
}
