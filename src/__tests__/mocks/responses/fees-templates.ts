import { FeeTypeEnum } from "@haapi/typescript-client";

export const feesTemplatesApi = [
  {
    id: "annualTuition1x",
    name: "Frais de Annuel 1x",
    type: FeeTypeEnum.TUITION,
    amount: 1_900_000,
    number_of_payments: 1,
    creation_datetime: "2024-01-28T18:31:57.808Z"
  },
  {
    id: "annualTuition9x",
    name: "Frais annuel 9x",
    type: FeeTypeEnum.TUITION,
    amount: 240_000,
    number_of_payments: 9,
    creation_datetime: "2024-01-28T18:35:22.123Z"
  },
  {
    id: "ghi789",
    name: "Ordinateur",
    type: FeeTypeEnum.HARDWARE,
    amount: 500_000,
    number_of_payments: 1,
    creation_datetime: "2024-01-28T18:40:45.567Z"
  },
  {
    id: "jkl012",
    name: "Concours",
    type: FeeTypeEnum.STUDENT_INSURANCE,
    amount: 100_000,
    number_of_payments: 1,
    creation_datetime: "2024-01-28T19:15:10.999Z"
  },
  {
    id: "mno345",
    name: "Frais médical",
    type: FeeTypeEnum.REMEDIAL_COSTS,
    amount: 150,
    number_of_payments: 1,
    creation_datetime: "2024-01-28T19:30:45.222Z"
  }
]

export const annual1xTemplate = feesTemplatesApi[0];
export const annual9xTemplate = feesTemplatesApi[1];
