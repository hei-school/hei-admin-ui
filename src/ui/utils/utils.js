import { WhoamiRoleEnum } from "@haapi/typescript-client";

/**
 * Retrieves the value of a nested property in an object using a specified path.
 *
 * @param {Object} obj - The source object from which to retrieve the value.
 * @param {string} path - The property path to retrieve, separated by dots (e.g., 'prop1.prop2.prop3').
 * @returns {*} The value of the specified property or undefined if it doesn't exist.
 */
export function getObjValue(obj, path) {
  return path
    .split(".")
    .reduce(
      (acc, key) => (acc && acc[key] !== "undefined" ? acc[key] : undefined),
      {...obj}
    );
}

export const DATE_OPTIONS = {
  weekday: "long",
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
};

export function formatDate(dateIso) {
  if (!dateIso) {
    return "";
  }
  if (typeof dateIso === "string") {
    const date = new Date(dateIso);
    const formatter = new Intl.DateTimeFormat("fr-FR", DATE_OPTIONS);
    const dateFormatter = formatter.format(date);
    return dateFormatter.at(0).toUpperCase() + dateFormatter.slice(1);
  }
}

export const ROLE_RENDERER = {
  MANAGER: "Admin",
  TEACHER: "Enseignant(e)",
  STUDENT: "Étudiant(e)"
}
