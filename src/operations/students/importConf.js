import { validateData } from "../../ui/haToolbar"
import { EnableStatus } from '@haapi/typescript-client'

export const optionalStudentHeaders = [
  { label:'Sex', value: 'sex' },
  { label: 'Anniversaire', value: 'birth_date' },
  { label: 'Adresse', value: 'address' }, 
  { label: 'Télephone',  value: 'phone' }
]

export const minimalStudentHeaders = [
  { label:'Réference', value: 'ref' },
  { label: 'Prénoms', value: 'first_name' },
  { label: 'Nom', value: 'last_name' }, 
  { label: 'Email', value: 'email' }, 
  { label: "Date d'entrée chez HEI", value: 'entrance_datetime' }
]

export const valideStudentData = (data)=>{
  return validateData(
    data, 
    minimalStudentHeaders.map(el=> Object.values(el)), 
    optionalStudentHeaders.map(el=> Object.values(el)), 
  );
}

export const transformStudentData = (data)=>{
  return data.map(element => {
    element.entrance_datetime = new Date(element.entrance_datetime).toISOString()
    element['status'] = EnableStatus.ENABLED
    return element
  })
}
