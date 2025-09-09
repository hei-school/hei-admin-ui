import {utils, writeFile} from "xlsx";

export const exportData = (data, headers, fileName, options = {}) => {
  const {sheetName = "Sheet1", compression = true, footerRows = []} = options;

  const worksheet = utils.json_to_sheet(data);

  const workbook = utils.book_new();

  utils.book_append_sheet(workbook, worksheet, sheetName);

  utils.sheet_add_aoa(worksheet, [headers], {origin: "A1"});

  if (footerRows.length > 0) {
    const dataLength = data.length;
    const startRow = dataLength + 2;
    utils.sheet_add_aoa(worksheet, footerRows, {origin: `A${startRow}`});
  }

  writeFile(workbook, `${fileName}.xlsx`, {compression});
};

export const exportGradeTemplate = (
  participants = [],
  fileName = "grade_template"
) => {
  const headers = ["student_ref", "score", "comment"];

  const participantRows =
    participants.length > 0
      ? participants.map((participant) => {
          const student = participant.student || {};
          const grade = participant.grade || {};
          return {
            student_ref: student.ref ?? "",
            score: grade.score ?? "",
            comment: "",
          };
        })
      : [{student_ref: "STD12345", score: "", comment: ""}];

  const footerRows = [
    ["# Instructions:"],
    ["# student_ref est obligatoire"],
    ["# Laisser score vide pour ne pas modifier la note existante"],
    ["# Le champ comment est optionnel"],
    ["# Score doit être entre 0 et 20"],
  ];

  exportData(participantRows, headers, fileName, {
    sheetName: "Notes Examen",
    footerRows,
  });
};

if (typeof window !== "undefined") {
  window.exportData = exportData;
  window.exportGradeTemplate = exportGradeTemplate;
}
