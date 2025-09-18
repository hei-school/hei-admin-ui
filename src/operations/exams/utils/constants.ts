export const EXAM_FORM_SECTIONS = {
  COURSE_ASSIGNMENT: "course_assignment",
  EXAM_DETAILS: "exam_details",
  COEFFICIENT: "coefficient",
} as const;

export const EXAM_VALIDATION_MESSAGES = {
  COEFFICIENT: {
    NUMERATOR_REQUIRED: "Le numérateur est requis",
    NUMERATOR_POSITIVE: "Le numérateur doit être positif",
    NUMERATOR_TOO_LARGE:
      "Le numérateur ne peut pas être supérieur au dénominateur",
    DENOMINATOR_REQUIRED: "Le dénominateur est requis",
    DENOMINATOR_POSITIVE: "Le dénominateur doit être positif",
    DENOMINATOR_TOO_SMALL:
      "Le dénominateur ne peut pas être inférieur au numérateur",
  },
  TITLE: {
    REQUIRED: "Le titre de l'examen est requis",
    TOO_SHORT: "Le titre doit contenir au moins 3 caractères",
    TOO_LONG: "Le titre ne peut pas dépasser 100 caractères",
  },
  DATE: {
    REQUIRED: "La date d'examen est requise",
    INVALID: "Date invalide",
  },
} as const;

export const EXAM_FORM_LABELS = {
  COURSE_ASSIGNMENT_SECTION: "Attribution du cours",
  EXAM_DETAILS_SECTION: "Détails de l'examen",
  COEFFICIENT_SECTION: "Coefficient",
  TITLE: "Titre de l'examen",
  EXAMINATION_DATE: "Date et heure de l'examen",
  NUMERATOR: "Numérateur",
  DENOMINATOR: "Dénominateur",
  COEFFICIENT_FRACTION: "Coefficient (fraction)",
} as const;

export const EXAM_ALERTS = {
  COURSE_ASSIGNMENT_INFO: {
    title: "Information",
    message:
      "Modifiez l'attribution du cours si nécessaire. Cela affectera les groupes et l'enseignant associés à cet examen.",
  },
  COEFFICIENT_WARNING: {
    title: "Attention",
    message:
      "Le coefficient détermine l'importance de cet examen dans le calcul de la note finale. Le numérateur ne peut pas être supérieur au dénominateur.",
  },
} as const;
