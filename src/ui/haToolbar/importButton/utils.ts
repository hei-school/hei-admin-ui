export const excelType =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel";

export interface ImportHeader {
  id: number;
  label: string;
  value: string;
  disabled: boolean;
}

export interface ImportValidationResult {
  isValid: boolean;
  message: string;
}

export type ImportRow = Record<string, unknown>;

export const cellToText = (cell: unknown): string => {
  if (cell instanceof Date) return cell.toString();
  const isPrintable =
    typeof cell === "string" ||
    typeof cell === "number" ||
    typeof cell === "boolean";
  return isPrintable ? String(cell) : "";
};

export type ImportProvider<TPayload> = (data: TPayload) => Promise<unknown>;

export type ImportRequest<TPayload> =
  | {
      provider: ImportProvider<TPayload>;
      transformData: (data: ImportRow[]) => TPayload;
    }
  | {
      provider: ImportProvider<ImportRow[]>;
      transformData?: undefined;
    };

export const sendImportRequest = <TPayload>(
  {provider, transformData}: ImportRequest<TPayload>,
  data: ImportRow[]
) => (transformData ? provider(transformData(data)) : provider(data));

export const validateData = (
  data: ReadonlyArray<object>,
  minimalHeaders: string[],
  optionalHeaders: string[]
): ImportValidationResult => {
  const result = {isValid: false, message: ""};

  const isAllValid = (data1: string[]) => {
    const areValidHeader = data1.every((el) =>
      [...minimalHeaders, ...optionalHeaders].includes(el)
    );
    const includeMinimal = minimalHeaders.every((el) => data1.includes(el));
    return {areValidHeader, includeMinimal};
  };
  if (data.length === 0) {
    result.message = "Il n'y a pas d'élément à insérer";
  } else if (data.length > 1000) {
    result.message = "Vous ne pouvez importer que 1000 éléments à la fois.";
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

export const excelDateToJsDate = (excelDate: number) => {
  const SECONDS_IN_DAY = 24 * 60 * 60;
  const MISSING_LEAP_YEAR_DAY = SECONDS_IN_DAY * 1000;
  const MAGIC_NUMBER_OF_DAYS = 25567 + 2;

  const delta = excelDate - MAGIC_NUMBER_OF_DAYS;
  const parsed = delta * MISSING_LEAP_YEAR_DAY;

  return new Date(parsed).toISOString();
};
