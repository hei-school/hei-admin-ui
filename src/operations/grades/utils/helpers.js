import {GRADE_HEADERS} from "@/operations/grades/utils/constants";
import {validateData} from "@/ui/haToolbar";

export const validateGradeData = (data) => {
  const minimalHeaders = GRADE_HEADERS.minimal.map((header) => header.value);
  const optionalHeaders = GRADE_HEADERS.optional.map((header) => header.value);

  const customValidator = (row) => {
    const errors = {};

    if (row.score !== undefined && row.score !== "" && row.score !== null) {
      const score = parseFloat(row.score);
      if (isNaN(score)) {
        errors.score = `La note "${row.score}" n'est pas un nombre valide`;
      } else if (score < 0 || score > 20) {
        errors.score = `La note doit être comprise entre 0 et 20 (reçu: ${score})`;
      }
    }

    if (row.score !== undefined && row.score !== "" && !row.comment) {
      errors.comment =
        "Le commentaire est obligatoire lorsque une note est fournie";
    }

    return Object.keys(errors).length > 0 ? errors : null;
  };

  return validateData(data, minimalHeaders, optionalHeaders, customValidator);
};

const transformGradeData = (data) =>
  data.map((row) => {
    return {
      student_ref: row.student_ref,
      ...(row.score !== undefined &&
        row.score !== "" &&
        row.score !== null && {
          grade: {
            score: parseFloat(row.score),
            student_id: null,
          },
        }),
      comment: row.comment || "",
    };
  });

export const transformGradesData = (data) => {
  if (!data || !Array.isArray(data)) {
    return [[], []];
  }
  return [[], transformGradeData(data)];
};

if (typeof window !== "undefined") {
  window.validateGradeData = validateGradeData;
  window.transformGradesData = transformGradesData;
}
