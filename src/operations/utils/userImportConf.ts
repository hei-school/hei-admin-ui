import {
  Coordinates,
  EnableStatus,
  SpecializationField,
} from "@haapi-b0fc7615/typescript-client";
import {
  ImportHeader,
  ImportRow,
  excelDateToJsDate,
  validateData,
} from "../../ui/haToolbar";

export const minimalUserHeaders: ImportHeader[] = [
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
export const optionalUserHeaders: ImportHeader[] = [
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

export const validateUserData = (data: ReadonlyArray<object>) => {
  return validateData(
    data,
    minimalUserHeaders.map((el) => el.value),
    optionalUserHeaders.map((el) => el.value)
  );
};

// an imported row, completed with the fields every user payload needs
export type ImportedUser = ImportRow & {
  status: EnableStatus;
  specialization_field: SpecializationField;
  coordinates: Coordinates;
};

export const transformUserData = (data: ImportRow[]): ImportedUser[] => {
  return data.map((element) => {
    // excel dates are serial numbers, Number() keeps the implicit coercion
    element.entrance_datetime = element.entrance_datetime
      ? excelDateToJsDate(Number(element.entrance_datetime))
      : element.entrance_datetime;

    element.birth_date = element.birth_date
      ? excelDateToJsDate(Number(element.birth_date))
      : element.birth_date;

    if (typeof element.student_refs === "string" && element.student_refs) {
      element.student_refs = element.student_refs
        .split(",")
        .map((ref) => ref.trim())
        .filter((ref) => ref.length > 0);
    }
    element.status = EnableStatus.ENABLED;
    // Object.assign keeps the in-place mutation and types the added fields
    const user: ImportedUser = Object.assign(element, {
      status: EnableStatus.ALUMNI,
      specialization_field: SpecializationField.COMMON_CORE,
      coordinates: {longitude: 0, latitude: 0},
    });

    const paymentFreq =
      user.payment_frequency == null
        ? undefined
        : String(user.payment_frequency).trim().toLowerCase();

    if (
      paymentFreq !== undefined &&
      ["mensuel", "mensuelle", "menusel", "mensuel"].includes(paymentFreq)
    ) {
      user.payment_frequency = "MONTHLY";
    } else if (
      paymentFreq !== undefined &&
      ["annuel", "annuelle", "anuel", "annuel"].includes(paymentFreq)
    ) {
      user.payment_frequency = "YEARLY";
    }

    return user;
  });
};

declare global {
  interface Window {
    validateUserData?: typeof validateUserData;
    transformUserData?: typeof transformUserData;
  }
}

if (typeof window !== "undefined") {
  window.validateUserData = validateUserData;
  window.transformUserData = transformUserData;
}
