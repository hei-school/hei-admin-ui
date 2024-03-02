import {EnableStatus, Sex} from "@haapi/typescript-client";

export const EMPTY_TEXT = "Non défini.e";

export function getGenderInFr(sex) {
  switch (sex) {
    case Sex.M:
      return "Homme";
    case Sex.F:
      return "Femme";
    case null: // display empty_text if sex is null
      return EMPTY_TEXT;
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
