import { Breadcrumb, BreadcrumbItem } from '@react-admin/ra-navigation'
import { useState } from 'react'
import dataProvider from './providers/dataProvider'

export const MyBreadcrumb = () => {
  const [studentRef, setStudentRef] = useState('...')
  const takeRefFunction = ({ record }) => {
    if (record) {
      if (record.ref) {
        return <spam>{record.ref}</spam>
      } else {
        const doEffect = async () => {
          const student = await dataProvider.getOne('students', { id: record.student_id })
          setStudentRef(student.data.ref)
        }
        doEffect()
        return <spam>{studentRef}</spam>
      }
    }
    return <spam>{'...'}</spam>
  }

  return (
    <Breadcrumb>
      <BreadcrumbItem name='students' label='Étudiants'>
        <BreadcrumbItem name='edit' label={takeRefFunction} />
        <BreadcrumbItem name='show' label={takeRefFunction} />
        <BreadcrumbItem name='create' label='créer' />
      </BreadcrumbItem>
      <BreadcrumbItem name='teachers' label='Enseignants'>
        <BreadcrumbItem name='edit' label={takeRefFunction} />
        <BreadcrumbItem name='show' label={takeRefFunction} />
        <BreadcrumbItem name='create' label='créer' />
      </BreadcrumbItem>
      <BreadcrumbItem name='profile' label='Profiles' />
      <BreadcrumbItem name='fees' label='Frais'>
        <BreadcrumbItem name='edit' label={takeRefFunction} />
        <BreadcrumbItem name='show' label={takeRefFunction} />
        <BreadcrumbItem name='create' label='créer' />
      </BreadcrumbItem>
      <BreadcrumbItem name='profile' label='Profiles' />
    </Breadcrumb>
  )
}
