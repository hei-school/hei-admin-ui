import {minLength, regex} from "react-admin";

export const TRANSACTION_PATTERN =
  /^MP[a-zA-Z0-9]{6}\.[a-zA-Z0-9]{4}\.[a-zA-Z0-9]{6}$/;

export const pspIdValidationContraints = [
  minLength(20, "La référence doit contenir exactement 20 caractères"),
  regex(
    TRANSACTION_PATTERN,
    "La référence n'est pas saisie correctement (ex : MP123456.1234.B12345)"
  ),
];
