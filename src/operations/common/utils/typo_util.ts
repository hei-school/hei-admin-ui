import {
  EnableStatus,
  FeeStatusEnum,
  Sex,
  WhoamiRoleEnum,
} from "@haapi-b0fc7615/typescript-client";

export const getGenderInFr = (sex?: Sex | null) => {
  switch (sex) {
    case Sex.M:
      return "Homme";
    case Sex.F:
      return "Femme";
    case null: // display empty_text if sex is null
      return "Non défini.e";
    default:
      throw new Error("Unknown gender");
  }
};

export const getUserStatusInFr = (status?: EnableStatus, sex?: Sex) => {
  const isWoman = sex === Sex.F;
  switch (status) {
    case EnableStatus.ENABLED:
      return isWoman ? "Active" : "Actif";
    case EnableStatus.SUSPENDED:
      return isWoman ? "Suspendue" : "Suspendu";
    case EnableStatus.DISABLED:
      return isWoman ? "Quittée" : "Quitté";
    case EnableStatus.ALUMNI:
      return isWoman ? "Alumnie" : "Alumni";
    default:
      throw new Error("Unknown user status");
  }
};

export const getFeesStatusInFr = (status?: FeeStatusEnum) => {
  switch (status) {
    case FeeStatusEnum.LATE:
      return "En retard";
    case FeeStatusEnum.PAID:
      return "Payé";
    case FeeStatusEnum.UNPAID:
      return "En cours";
    case FeeStatusEnum.PENDING:
      return "En cours de vérification";
    default:
      throw new Error("Unknown fees status");
  }
};

export const getUserRoleInFr = (userRole?: string | null, sex?: Sex) => {
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
    case WhoamiRoleEnum.STAFF_MEMBER:
      return "Staff";
    case WhoamiRoleEnum.ORGANIZER:
      return isWoman ? "Organisatrice" : "Organisateur";
    default:
      throw new Error("Unknown user role");
  }
};

declare global {
  interface Window {
    getGenderInFr?: typeof getGenderInFr;
    getUserStatusInFr?: typeof getUserStatusInFr;
    getFeesStatusInFr?: typeof getFeesStatusInFr;
    getUserRoleInFr?: typeof getUserRoleInFr;
  }
}

if (typeof window !== "undefined") {
  window.getGenderInFr = getGenderInFr;
  window.getUserStatusInFr = getUserStatusInFr;
  window.getFeesStatusInFr = getFeesStatusInFr;
  window.getUserRoleInFr = getUserRoleInFr;
}
