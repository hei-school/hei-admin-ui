export const excelType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'

export const validateData = (data, minimalHeaders, optionalHeaders) => {
  const result = { isValid: false, message: '' }

  const isAllValid = data1 => {
    const areValidHeader = data1.every(el => [...minimalHeaders, ...optionalHeaders].includes(el))
    const includeMinimal = minimalHeaders.every(el => data1.includes(el))
    return { areValidHeader, includeMinimal }
  }

  if (data.length === 0) {
    result.message = "Il n'y a pas d'élément à insérer"
  } else if (data.length >= 10) {
    result.message = 'Vous ne pouvez importer que 10 éléments à la fois.'
  } else {
    const isValid = isAllValid(Object.keys(data[0]))
    if (!isValid.areValidHeader) {
      result.message = 'Veuillez re-vérifier les en-têtes de votre fichier'
    } else if (!isValid.includeMinimal) {
      result.message = 'Quelques en-têtes obligatoire sont manquantes'
    } else {
      result.isValid = true
    }
  }

  return result
}
