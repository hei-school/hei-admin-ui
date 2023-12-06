import { FeeTypeEnum } from '@haapi/typescript-client'
import { excelDateToJsDate, validateData } from '../../ui/haToolbar'

export const minimalFeesHeaders = [
  { id: 1, label: 'Type (type: Écolage ou Matériel)', value: 'type', disabled: true },
  { id: 2, label: 'Montant total (total_amount)', value: 'total_amount', disabled: true },
  { id: 3, label: "Date limite (due_datetime)", value: 'due_datetime', disabled: true }
]

export const optionalFeesHeaders = [
  { id: 4, label: 'Commentaire (comment)', value: 'comment', disabled: false },
]

export const valideFeesData = data => {
  const response = validateData( data, minimalFeesHeaders.map(el => el.value), optionalFeesHeaders.map(el => el.value))
  if(response.isValid){
    response.isValid = false
    if(data.some(el => isNaN(Number(el.due_datetime))))
      response.message = "Certain(s) date limite(s) n'est (ne sont) pas valide(s)."
    else if(data.some(el => isNaN(Number(el.total_amount))))
      response.message = 'Tous les montants totaux doivent être des nombres'
    else if(data.some(el => !el.type ? false :  !FeeTypeImport[el.type.toLowerCase()]))
      response.message = "Certain(s) type(s) de frais n'est (ne sont) pas valide(s)."
    else
      response.isValid = true
  }
  
  return response
}

const FeeTypeImport = {
  ecolage: FeeTypeEnum.TUITION,
  'écolage': FeeTypeEnum.TUITION,
  materiel: FeeTypeEnum.HARDWARE,
  'matériel': FeeTypeEnum.HARDWARE
}

export const transformFeesData = (data, student_id) => {
  return [data.map(el => ({
    ...el,
    student_id,
    due_datetime: excelDateToJsDate(el.due_datetime),
    total_amount: Number(el.total_amount),
    type: FeeTypeImport[el.type.toLowerCase()],
    creation_datetime: new Date().toISOString()
  }))]
}
