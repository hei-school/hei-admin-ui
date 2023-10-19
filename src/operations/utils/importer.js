export const importHeaders = ['ref','first_name','last_name','email','sex','birth_date','address','phone','entrance_datetime']
export const minImportHeaders = ['ref','first_name','last_name','email','entrance_datetime']

export const importValidator = (data) => {
  let isValidate = false;
  let message = "";

  switch (true) {
    case data.length === 0:
      message = "Il n'y a pas d'élément à insérer";
      break;
    case Object.keys(data[0]).toString() === minImportHeaders.toString() && data.length <= 10:
      isValidate = true
      break;
    case Object.keys(data[0]).toString() !== importHeaders.toString():
      message = 'Veuillez re-vérifier les en-têtes de votre fichier';
      break;
    case data.length >= 10:
      message = 'Vous ne pouvez importer que 10 éléments à la fois.';
      break;
    default:
      isValidate = true;
      break;
  }

  return { isValidate, message };
};
