import { validateData } from '../../ui/haToolbar'
import { EnableStatus } from '@haapi/typescript-client'

export const minimalStudentHeaders = [
  { id: 1, label: 'Référence (ref)', value: 'ref', disabled: true },
  { id: 2, label: 'Prénoms (first_name)', value: 'first_name', disabled: true },
  { id: 3, label: 'Nom (last_name)', value: 'last_name', disabled: true },
  { id: 4, label: 'Mail (email)', value: 'email', disabled: true },
  { id: 5, label: "Date d'entrée à HEI (entrance_datetime)", value: 'entrance_datetime', disabled: true }
]
export const optionalStudentHeaders = [
  { id: 6, label: 'Sexe (sex)', value: 'sex', disabled: false },
  { id: 7, label: 'Date de naissance (birth_date)', value: 'birth_date', disabled: false },
  { id: 9, label: 'Adresse (address)', value: 'address', disabled: false },
  { id: 10, label: 'Numéro de téléphone (phone)', value: 'phone', disabled: false }
]

export const valideStudentData = data => {
  return validateData(
    data,
    minimalStudentHeaders.map(el => el.value),
    optionalStudentHeaders.map(el => el.value)
  )
}

export const transformStudentData = data => {
  return data.map(element => {
    element.entrance_datetime = new Date(element.entrance_datetime).toISOString()
    element['status'] = EnableStatus.ENABLED
    return element
  })
}
