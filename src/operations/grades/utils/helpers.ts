import {GRADE_HEADERS} from "@/operations/grades/utils/constants";
import {ImportRow, validateData} from "@/ui/haToolbar";

type GradeRowErrors = Partial<Record<"score" | "comment", string>>;

// the cells are sent as read in the file, only the score is parsed
interface GradeImport {
  student_ref: unknown;
  grade?: {
    score: number;
    student_id: null;
  };
  comment: unknown;
}

// not applied yet: validateData only checks the headers of the file
export const validateGradeRow = (row: ImportRow): GradeRowErrors | null => {
  const errors: GradeRowErrors = {};

  if (row.score !== undefined && row.score !== "" && row.score !== null) {
    const score = Number.parseFloat(String(row.score));
    if (Number.isNaN(score)) {
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

export const validateGradeData = (data: ReadonlyArray<ImportRow>) => {
  const minimalHeaders = GRADE_HEADERS.minimal.map((header) => header.value);
  const optionalHeaders = GRADE_HEADERS.optional.map((header) => header.value);

  return validateData(data, minimalHeaders, optionalHeaders);
};

const transformGradeData = (data: ReadonlyArray<ImportRow>): GradeImport[] =>
  data.map((row) => {
    return {
      student_ref: row.student_ref,
      ...(row.score !== undefined &&
        row.score !== "" &&
        row.score !== null && {
          grade: {
            score: Number.parseFloat(String(row.score)),
            student_id: null,
          },
        }),
      comment: row.comment || "",
    };
  });

export const transformGradesData = (
  data?: ReadonlyArray<ImportRow> | null
): [[], GradeImport[]] => {
  if (!data || !Array.isArray(data)) {
    return [[], []];
  }
  return [[], transformGradeData(data)];
};

declare global {
  interface Window {
    validateGradeData?: typeof validateGradeData;
    transformGradesData?: typeof transformGradesData;
  }
}

if (typeof window !== "undefined") {
  window.validateGradeData = validateGradeData;
  window.transformGradesData = transformGradesData;
}
