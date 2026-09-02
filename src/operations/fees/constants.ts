import {mapToChoices} from "@/utils";
import {
  AdvancedFeeStatisticsType,
  ArchiveStatusEnum,
  FeeCategory,
  FeeFrequency,
  FeeStatusEnum,
  FeeTypeEnum,
  PaymentTypeEnum,
} from "@haapi-b0fc7615/typescript-client";

export const FEE_STATUS = {
  LATE: "En retard",
  PAID: "Payés",
  UNPAID: "Non payés",
  PENDING: "En cours de vérification",
  ALL: "Tout les frais",
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
  {label: "Rattrapage", value: FeeTypeEnum.RETAKE_EXAM_COSTS},
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

export const ADVANCED_FEE_STATISTICS_TYPE_CHOICES = [
  {label: "Comptable", value: AdvancedFeeStatisticsType.ACCOUNTING},
  {label: "Encaissement", value: AdvancedFeeStatisticsType.RECEIPT},
];

export const PAYMENT_TYPE = {
  [PaymentTypeEnum.MOBILE_MONEY]: "MOBILE MONEY",
  [PaymentTypeEnum.CREDIT]: "CREDIT",
} as const;

export const PAYMENT_TYPE_CHOICES = mapToChoices(PAYMENT_TYPE, "id", "name");

// Typed against the generated enums so a new enum member fails to compile
// here instead of silently falling back to the raw value at runtime.
export const FEE_STATUS_LABEL: Record<FeeStatusEnum, string> = {
  [FeeStatusEnum.UNPAID]: "Non payé",
  [FeeStatusEnum.PAID]: "Payé",
  [FeeStatusEnum.LATE]: "En retard",
  [FeeStatusEnum.PENDING]: "En cours de vérification",
};

export const ARCHIVE_STATUS_LABEL: Record<ArchiveStatusEnum, string> = {
  [ArchiveStatusEnum.TO_ARCHIVE]: "En attente d'archivage",
  [ArchiveStatusEnum.ARCHIVED]: "Archivé",
  [ArchiveStatusEnum.REJECTED]: "Rejeté",
};
