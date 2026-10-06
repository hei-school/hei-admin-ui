export const importHeaders = [
  "ref",
  "first_name",
  "last_name",
  "email",
  "sex",
  "birth_date",
  "address",
  "phone",
  "entrance_datetime",
  "payment_frequency",
];
export const minimalImportHeaders = [
  "ref",
  "first_name",
  "last_name",
  "email",
  "entrance_datetime",
];

export const validateData = (
  data: ReadonlyArray<object>,
  headers: ReadonlyArray<string>
) => {
  let isValid = false;
  let message = "";
  const isEqual = (data1: string[]) => {
    let isEq = true;
    data1.forEach((element) => {
      if (!headers.includes(element)) {
        isEq = false;
      }
    });
    return isEq;
  };
  if (data.length === 0) {
    message = "Il n'y a pas d'élément à insérer";
  } else if (!isEqual(Object.keys(data[0]))) {
    message = "Veuillez re-vérifier les en-têtes de votre fichier";
  } else if (data.length >= 1000) {
    message = "Vous ne pouvez importer que 1000 éléments à la fois.";
  } else {
    isValid = true;
  }

  return {isValid: isValid, message};
};

declare global {
  interface Window {
    validateData?: typeof validateData;
    importHeaders?: typeof importHeaders;
    minimalImportHeaders?: typeof minimalImportHeaders;
  }
}

if (typeof window !== "undefined") {
  window.validateData = validateData;
  window.importHeaders = importHeaders;
  window.minimalImportHeaders = minimalImportHeaders;
}
