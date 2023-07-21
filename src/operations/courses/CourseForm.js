import { TextInput } from 'react-admin'
const CourseForm = () => {
  return (
    <>
      <TextInput source='code' label='Code' fullWidth={true} />
      <TextInput source='name' label='Nom' fullWidth={true} />
      <TextInput source='credits' label='Coefficient' fullWidth={true} />
      <TextInput source='total_hours' label='Heure totale' fullWidth={true} />
    </>
  )
}

export default CourseForm
