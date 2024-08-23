import {FeeTypeEnum} from "@haapi/typescript-client";

export const FEESTEMPLATES_CHOICES = [
  {label: "Écolage", value: FeeTypeEnum.TUITION},
  {label: "Matériel", value: FeeTypeEnum.HARDWARE},
  {label: "Assurance étudiante", value: FeeTypeEnum.STUDENT_INSURANCE},
  {label: "Autres frais", value: FeeTypeEnum.REMEDIAL_COSTS},
];
