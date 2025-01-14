import {excelDateToJsDate, validateData} from "../../ui/haToolbar";
import {EnableStatus} from "@haapi/typescript-client";

export const minimalUserHeaders = [
  {id: 1, label: "Référence (ref)", value: "ref", disabled: true},
  {id: 2, label: "Prénoms (first_name)", value: "first_name", disabled: true},
  {id: 3, label: "Nom (last_name)", value: "last_name", disabled: true},
  {id: 4, label: "Mail (email)", value: "email", disabled: true},
  {
    id: 5,
    label: "Date d'entrée à HEI (entrance_datetime)",
    value: "entrance_datetime",
    disabled: true,
  },
];
export const optionalUserHeaders = [
  {id: 6, label: "Sexe (sex)", value: "sex", disabled: false},
  {
    id: 7,
    label: "Date de naissance (birth_date)",
    value: "birth_date",
    disabled: false,
  },
  {id: 9, label: "Adresse (address)", value: "address", disabled: false},
  {
    id: 10,
    label: "Numéro de téléphone (phone)",
    value: "phone",
    disabled: false,
  },
  {
    id: 12,
    label: "fréquence de paiement",
    value: "payment_frequency",
    disabled: false,
  },
  {
    id: 13,
    label: "Lieu de naissance",
    value: "birth_place",
    disabled: false,
  },
  {
    id: 14,
    label: "Carte d'identité nationale",
    value: "nic",
    disabled: false,
  },
  {
    id: 15,
    label: "Student STD(monitor seulement)",
    value: "student_refs",
    disabled: false,
  },
];

export const validateUserData = (data) => {
  return validateData(
    data,
    minimalUserHeaders.map((el) => el.value),
    optionalUserHeaders.map((el) => el.value)
  );
};

export const transformUserData = (data) => {
  return data.map((element) => {
    element.entrance_datetime &&
      (element.entrance_datetime = excelDateToJsDate(
        element.entrance_datetime
      ));
    element.birth_date &&
      element.birth_date &&
      (element.birth_date = excelDateToJsDate(element.birth_date));
    element["status"] = EnableStatus.ENABLED;
    element["coordinates"] = {longitude: 0, latitude: 0};
    if (element["payment_frequency"] === "mensuel") {
      element["payment_frequency"] = "MONTHLY";
    } else if (element["payment_frequency"] === "annuel") {
      element["payment_frequency"] = "YEARLY";
    }
    if (element["student_refs"]) {
      element["student_refs"] = element["student_refs"]
        .split(",")
        .map((ref) => ref.trim());
    }
    return element;
  });
};
