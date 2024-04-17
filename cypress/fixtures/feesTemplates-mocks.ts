import {FeeTemplate} from "@haapi/typescript-client";

export const feesTemplatesMocks: FeeTemplate[] = [
  {
    id: "id1",
    name: "Frais 1 mois",
    type: "HARDWARE",
    amount: 5000,
    number_of_payments: 5,
    creation_datetime: new Date(),
  },
];

export const feesTemplates1Mock =
  feesTemplatesMocks[0] as Required<FeeTemplate>;
