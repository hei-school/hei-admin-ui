import {FeeCategory, FeeFrequency, FeeTypeEnum} from "@haapi/typescript-client";
import {excelDateToJsDate, validateData} from "../../ui/haToolbar";

export const minimalFeesHeaders = [
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

export const optionalFeesHeaders = [
  {id: 4, label: "Commentaire (comment)", value: "comment", disabled: false},
];

export const valideFeesData = (data) => {
  const response = validateData(
    data,
    minimalFeesHeaders.map((el) => el.value),
    optionalFeesHeaders.map((el) => el.value)
  );
  if (response.isValid) {
    response.isValid = false;
    if (data.some((el) => isNaN(Number(el.due_datetime))))
      response.message =
        "Certain(s) date limite(s) n'est (ne sont) pas valide(s).";
    else if (data.some((el) => isNaN(Number(el.total_amount))))
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

const FeeTypeImport = {
  ecolage: FeeTypeEnum.TUITION,
  écolage: FeeTypeEnum.TUITION,
  materiel: FeeTypeEnum.HARDWARE,
  matériel: FeeTypeEnum.HARDWARE,
};
const FeeCategoryImport = {
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

const FeeFrequencyImport = {
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
export const transformFeesData = (data, student_id) => {
  return [
    data.map((el) => ({
      ...el,
      student_id,
      due_datetime: excelDateToJsDate(el.due_datetime),
      category: FeeCategoryImport[el.category.toLowerCase()],
      frequency: FeeFrequencyImport[el.frequency.toLowerCase()],
      total_amount: Number(el.total_amount),
      type: FeeTypeImport[el.type.toLowerCase()],
      creation_datetime: new Date().toISOString(),
    })),
  ];
};
