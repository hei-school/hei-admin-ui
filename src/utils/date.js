const DATE_OPTIONS = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

const TIME_OPTIONS = {
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
};

export function formatDate(dateIso, showTime = true) {
  const DATETIME_OPTIONS = showTime ? { ...DATE_OPTIONS, ...TIME_OPTIONS } : DATE_OPTIONS;
  return new Date(dateIso).toLocaleDateString(
    "fr-FR",
    DATETIME_OPTIONS
  );
}

export const ROLE_RENDERER = {
  MANAGER: "Admin",
  TEACHER: "Enseignant(e)",
  STUDENT: "Étudiant(e)",
};
