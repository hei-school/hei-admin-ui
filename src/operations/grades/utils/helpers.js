import {GRADE_HEADERS} from "@/operations/grades/utils/constants";
import {validateData} from "@/ui/haToolbar";

export const validateGradeData = (data) => {
  const requiredFields = GRADE_HEADERS.minimal
    .filter((header) => header.required)
    .map((header) => header.value);

  const customValidator = (row) => {
    const errors = {};

    if (
      row["grade.score"] !== undefined &&
      row["grade.score"] !== "" &&
      !row.comment
    ) {
      errors.comment =
        "Le commentaire est obligatoire lorsque une note est fournie";
    }

    return Object.keys(errors).length > 0 ? errors : null;
  };

  return validateData(
    data,
    requiredFields,
    GRADE_HEADERS.optional.map((el) => el.value),
    customValidator
  );
};

const transformGradeData = (data) =>
  data.map(
    ({"grade.score": score, comment, student_ref, student = {}, ...rest}) => {
      const studentFields = Object.entries(rest).reduce((acc, [key, value]) => {
        if (key.startsWith("student.")) {
          const field = key.split(".")[1];
          acc[field] = value;
        }
        return acc;
      }, {});

      return {
        student_ref,
        ...(score !== undefined && {
          grade: {
            score: parseFloat(score),
            comment: comment || "",
          },
        }),
        student: {
          ...student,
          ...studentFields,
          ref: student_ref,
        },
      };
    }
  );

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
