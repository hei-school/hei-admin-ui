export const validateCoefficientNumerator = (
  value: number,
  allValues: any
): string | undefined => {
  if (!value) return "Le numérateur est requis";
  if (value <= 0) return "Le numérateur doit être positif";
  if (
    allValues?.coefficient?.denominator &&
    value > allValues.coefficient.denominator
  ) {
    return "Le numérateur ne peut pas être supérieur au dénominateur";
  }
  return undefined;
};

export const validateCoefficientDenominator = (
  value: number,
  allValues: any
): string | undefined => {
  if (!value) return "Le dénominateur est requis";
  if (value <= 0) return "Le dénominateur doit être positif";
  if (
    allValues?.coefficient?.numerator &&
    allValues.coefficient.numerator > value
  ) {
    return "Le dénominateur ne peut pas être inférieur au numérateur";
  }
  return undefined;
};

export const validateExamTitle = (value: string): string | undefined => {
  if (!value || value.trim().length === 0)
    return "Le titre de l'examen est requis";
  if (value.trim().length < 3)
    return "Le titre doit contenir au moins 3 caractères";
  if (value.trim().length > 100)
    return "Le titre ne peut pas dépasser 100 caractères";
  return undefined;
};

export const validateExaminationDate = (
  value: string | Date
): string | undefined => {
  if (!value) return "La date d'examen est requise";

  const examDate = new Date(value);

  if (isNaN(examDate.getTime())) return "Date invalide";

  return undefined;
};
