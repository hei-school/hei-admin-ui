import {
  FeeCategory,
  FeeFrequency,
  FeeTypeEnum,
} from "@haapi-b0fc7615/typescript-client";
import {
  ImportHeader,
  ImportRow,
  ImportValidationResult,
  excelDateToJsDate,
  validateData,
} from "../../ui/haToolbar";

// one row of the imported file, keyed by the headers below
export type FeeImportRow = {
  type: string;
  total_amount: number | string;
  due_datetime: number;
  category: string;
  frequency: string;
  comment?: string;
};

export const minimalFeesHeaders: ImportHeader[] = [
  {
    id: 1,
    label: "Type (type: Écolage ou Matériel)",
    value: "type",
    disabled: true,
  },
  {
    id: 2,
    label: "Montant total (total_amount)",
    value: "total_amount",
    disabled: true,
  },
  {
    id: 3,
    label: "Date limite (due_datetime)",
    value: "due_datetime",
    disabled: true,
  },
  {
    id: 5,
    label: "catégorie",
    value: "category",
    disabled: true,
  },
  {
    id: 6,
    label: "Fréquence",
    value: "frequency",
    disabled: true,
  },
];

export const optionalFeesHeaders: ImportHeader[] = [
  {id: 4, label: "Commentaire (comment)", value: "comment", disabled: false},
];

export const valideFeesData = (rows: ImportRow[]): ImportValidationResult => {
  // the cells of the required columns are read as text (or number) from the sheet
  const data = rows as FeeImportRow[];
  const response = validateData(
    data,
    minimalFeesHeaders.map((el) => el.value),
    optionalFeesHeaders.map((el) => el.value)
  );
  if (response.isValid) {
    response.isValid = false;
    if (data.some((el) => Number.isNaN(Number(el.due_datetime))))
      response.message =
        "Certain(s) date limite(s) n'est (ne sont) pas valide(s).";
    else if (data.some((el) => Number.isNaN(Number(el.total_amount))))
      response.message = "Tous les montants totaux doivent être des nombres";
    else if (
      data.some((el) =>
        !el.type ? false : !FeeTypeImport[el.type.toLowerCase()]
      )
    )
      response.message =
        "Certain(s) type(s) de frais n'est (ne sont) pas valide(s).";
    else if (
      data.some((el) =>
        !el.category ? false : !FeeCategoryImport[el.category.toLowerCase()]
      )
    )
      response.message =
        "Certain(s) catégorie(s) de frais n'est (ne sont) pas valide(s).";
    else if (
      data.some((el) =>
        !el.frequency ? false : !FeeFrequencyImport[el.frequency.toLowerCase()]
      )
    )
      response.message =
        "Certain(s) fréquence(s) de frais n'est (ne sont) pas valide(s).";
    else response.isValid = true;
  }

  return response;
};

const FeeTypeImport: Partial<Record<string, FeeTypeEnum>> = {
  ecolage: FeeTypeEnum.TUITION,
  écolage: FeeTypeEnum.TUITION,
  materiel: FeeTypeEnum.HARDWARE,
  matériel: FeeTypeEnum.HARDWARE,
};
const FeeCategoryImport: Partial<Record<string, FeeCategory>> = {
  "l1": FeeCategory.L1,
  "l2": FeeCategory.L2,
  "l3": FeeCategory.L3,
  "autre": FeeCategory.OTHER,
  "alternant": FeeCategory.WORK_FEES,
  "alternance": FeeCategory.WORK_FEES,
  "non défini": FeeCategory.UNKNOWN,
  "non defini": FeeCategory.UNKNOWN,
  "indéfini": FeeCategory.UNKNOWN,
  "indefini": FeeCategory.UNKNOWN,
  "inconnu": FeeCategory.UNKNOWN,
};

const FeeFrequencyImport: Partial<Record<string, FeeFrequency>> = {
  "annuel": FeeFrequency.YEARLY,
  "annuelle": FeeFrequency.YEARLY,
  "mensuel": FeeFrequency.MONTHLY,
  "mensuelle": FeeFrequency.MONTHLY,
  "non défini": FeeFrequency.UNKNOWN,
  "non defini": FeeFrequency.UNKNOWN,
  "indéfini": FeeFrequency.UNKNOWN,
  "indefini": FeeFrequency.UNKNOWN,
  "inconnu": FeeFrequency.UNKNOWN,
};
export const transformFeesData = (rows: ImportRow[], student_id: string) => {
  // the rows were checked by valideFeesData before being transformed
  const data = rows as FeeImportRow[];
  return [
    data.map((el) => ({
      ...el,
      student_id,
      // l'API attend des Date : sérialisées en JSON, elles donnent les mêmes
      // chaînes ISO qu'auparavant
      due_datetime: new Date(excelDateToJsDate(el.due_datetime)),
      category: FeeCategoryImport[el.category.toLowerCase()],
      frequency: FeeFrequencyImport[el.frequency.toLowerCase()],
      total_amount: Number(el.total_amount),
      type: FeeTypeImport[el.type.toLowerCase()],
      creation_datetime: new Date(),
    })),
  ];
};
