import { DateField } from 'react-admin'

export const CustomDateField = ({ source, label, showTime }) => {
  let optionsObject = { year: 'numeric', month: 'long', day: 'numeric' }
  showTime && Object.assign(optionsObject, { hour: 'numeric', minute: 'numeric', second: 'numeric' })
  return <DateField source={source} label={label} locales='fr-FR' options={optionsObject} />
}
