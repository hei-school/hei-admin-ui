import {mapToChoices} from "@/utils";
import {FeeTypeEnum} from "@haapi/typescript-client";

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
  {label: "Assurance étudiante", value: FeeTypeEnum.STUDENT_INSURANCE},
  {label: "Rattrapage", value: FeeTypeEnum.REMEDIAL_COSTS},
] as const;

export const FEES_TYPES_CHOICES = FEESTEMPLATES_CHOICES.map((choice) => ({
  name: choice.label,
  id: choice.value,
}));

export const MPBS_CHOICES = mapToChoices(MPBS_STATUS_LABEL, "id", "name");
