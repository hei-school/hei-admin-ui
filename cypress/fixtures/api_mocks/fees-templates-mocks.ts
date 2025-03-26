import {FeeTemplate, FeeTypeEnum} from "@haapi/typescript-client";

export const feesTemplatesMocks: FeeTemplate[] = [
  {
    id: "id1",
    name: "Frais 1 mois",
    type: "HARDWARE",
    amount: 5000,
    category: "OTHER",
    frequency: "MONTHLY",
    number_of_payments: 5,
    creation_datetime: new Date(),
  },
  {
    id: "annualTuition1x",
    name: "Frais de Annuel 1x",
    type: FeeTypeEnum.TUITION,
    category: "OTHER",
    frequency: "MONTHLY",
    amount: 1_900_000,
    number_of_payments: 1,
    creation_datetime: new Date("2024-01-28"),
  },
  {
    id: "annualTuition9x",
    name: "Frais annuel 9x",
    type: FeeTypeEnum.TUITION,
    category: "OTHER",
    frequency: "MONTHLY",
    amount: 240_000,
    number_of_payments: 9,
    creation_datetime: new Date("2024-01-28"),
  },
  {
    id: "ghi789",
    name: "Ordinateur",
    type: FeeTypeEnum.HARDWARE,
    category: "OTHER",
    frequency: "MONTHLY",
    amount: 500_000,
    number_of_payments: 1,
    creation_datetime: new Date("2024-01-28"),
  },
  {
    id: "jkl012",
    name: "Concours",
    type: FeeTypeEnum.STUDENT_INSURANCE,
    amount: 100_000,
    category: "OTHER",
    frequency: "MONTHLY",
    number_of_payments: 1,
    creation_datetime: new Date("2024-01-28"),
  },
  {
    id: "mno345",
    name: "Frais médical",
    type: FeeTypeEnum.REMEDIAL_COSTS,
    category: "OTHER",
    frequency: "MONTHLY",
    amount: 150,
    number_of_payments: 1,
    creation_datetime: new Date("2024-01-28"),
  },
];

export const feesTemplates1Mock =
  feesTemplatesMocks[0] as Required<FeeTemplate>;
export const annual1xTemplate = feesTemplatesMocks[1] as Required<FeeTemplate>;
export const annual9xTemplate = feesTemplatesMocks[2] as Required<FeeTemplate>;
