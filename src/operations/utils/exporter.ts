import {utils, writeFile} from "xlsx";
import {importHeaders} from "./importer";

export const exportHeaders = ["id", ...importHeaders, "status"];

export const exportData = (
  data: object[],
  headers: string[],
  fileName: string
) => {
  const worksheet = utils.json_to_sheet(data);

  const workbook = utils.book_new();

  utils.book_append_sheet(workbook, worksheet, "Sheet1");
  utils.sheet_add_aoa(worksheet, [headers], {origin: "A1"});

  writeFile(workbook, `${fileName}.xlsx`, {compression: true});
};

declare global {
  interface Window {
    exportData?: typeof exportData;
    exportHeaders?: typeof exportHeaders;
  }
}

if (typeof window !== "undefined") {
  window.exportData = exportData;
  window.exportHeaders = exportHeaders;
}
