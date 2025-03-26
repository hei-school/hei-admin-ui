import {mapToChoices} from "@/utils";
import {FeeCategory, FeeFrequency, FeeTypeEnum} from "@haapi/typescript-client";

export const FEE_STATUS = {
  LATE: "En retard",
  PAID: "Payés",
  UNPAID: "En cours",
  PENDING: "En cours de vérification",
} as const;

export const MPBS_STATUS_LABEL = {
  SUCCESS: "Paiement avec succès",
  FAILED: "Paiement échoué",
  PENDING: "Vérification en cours",
} as const;

export const FEE_STATUS_CHOICES = mapToChoices(FEE_STATUS, "id", "name");

export const FEESTEMPLATES_CHOICES = [
  {label: "Écolage", value: FeeTypeEnum.TUITION},
  {label: "Matériel", value: FeeTypeEnum.HARDWARE},
  {label: "Frais généraux", value: FeeTypeEnum.STUDENT_INSURANCE},
  {label: "Rattrapage", value: FeeTypeEnum.REMEDIAL_COSTS},
] as const;

export const FEES_TYPES_CHOICES = FEESTEMPLATES_CHOICES.map((choice) => ({
  name: choice.label,
  id: choice.value,
}));

export const MPBS_CHOICES = mapToChoices(MPBS_STATUS_LABEL, "id", "name");

export const CATEGORY = [
  {label: "Frais L1", value: FeeCategory.L1},
  {label: "Frais L2", value: FeeCategory.L2},
  {label: "Frais L3", value: FeeCategory.L3},
  {label: "Frais d'alternance", value: FeeCategory.WORK_FEES},
  {label: "Autres frais", value: FeeCategory.OTHER},
  {label: "Catégorie non définie", value: FeeCategory.UNKNOWN},
] as const;

export const CATEGORY_CHOICES = CATEGORY.map((choice) => ({
  name: choice.label,
  id: choice.value,
}));

export const FEES_FREQUENCY = [
  {label: "Mensuel", value: FeeFrequency.MONTHLY},
  {label: "Annuel", value: FeeFrequency.YEARLY},
  {label: "Non definie", value: FeeFrequency.UNKNOWN},
];

export const FEES_FREQUENCY_CHOICES = FEES_FREQUENCY.map((choice) => ({
  name: choice.label,
  id: choice.value,
}));
