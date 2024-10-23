export const excelType =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel";

export const validateData = (data, minimalHeaders, optionalHeaders) => {
  const result = {isValid: false, message: ""};

  const isAllValid = (data1) => {
    const areValidHeader = data1.every((el) =>
      [...minimalHeaders, ...optionalHeaders].includes(el)
    );
    const includeMinimal = minimalHeaders.every((el) => data1.includes(el));
    return {areValidHeader, includeMinimal};
  };
  if (data.length === 0) {
    result.message = "Il n'y a pas d'élément à insérer";
  } else if (data.length > 20) {
    result.message = "Vous ne pouvez importer que 20 éléments à la fois.";
  } else {
    const isValid = isAllValid(Object.keys(data[0]));
    if (!isValid.areValidHeader) {
      result.message = "Veuillez re-vérifier les en-têtes de votre fichier";
    } else if (!isValid.includeMinimal) {
      result.message = "Quelques en-têtes obligatoire sont manquantes";
    } else {
      result.isValid = true;
    }
  }

  return result;
};

// excel date is like a number
// https://docs.telerik.com/aspnet-core/knowledge-base/spreadsheet-dates-to-javascript
export function excelDateToJsDate(excelDate) {
  const SECONDS_IN_DAY = 24 * 60 * 60;
  const MISSING_LEAP_YEAR_DAY = SECONDS_IN_DAY * 1000;
  const MAGIC_NUMBER_OF_DAYS = 25567 + 2;

  const delta = excelDate - MAGIC_NUMBER_OF_DAYS;
  const parsed = delta * MISSING_LEAP_YEAR_DAY;

  return new Date(parsed).toISOString();
}
