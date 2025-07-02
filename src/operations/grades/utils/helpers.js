import {GRADE_HEADERS} from "@/operations/grades/utils/constants";
import {validateData} from "@/ui/haToolbar";

export const validateGradeData = (data) =>
  validateData(
    data,
    GRADE_HEADERS.minimal.map((el) => el.value),
    GRADE_HEADERS.optional.map((el) => el.value)
  );

const transformGradeData = (data) =>
  data.map(({"grade.score": score, ...rest}) => ({
    ...rest,
    grade: {score: score ?? 0},
  }));

export const transformGradesData = (data) => [[[], transformGradeData(data)]];

if (typeof window !== "undefined") {
  window.validateGradeData = validateGradeData;
  window.transformGradesData = transformGradesData;
}
