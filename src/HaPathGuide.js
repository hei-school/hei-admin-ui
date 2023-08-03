import { useState } from 'react'

import { Breadcrumb, BreadcrumbItem } from '@react-admin/ra-navigation'

import dataProvider from './providers/dataProvider'

export const HaPathGuide = () => {
  const [studentRef, setStudentRef] = useState('...')
  const getStudentRef = ({ record }) => {
    if (record) {
      if (record?.ref) {
        setStudentRef(record.ref)
      } else if (record?.code) {
        setStudentRef(record.code)
      } else {
        const doEffect = async () => {
          const student = await dataProvider.getOne('students', { id: record.student_id })
          setStudentRef(student.data.ref)
        }
        doEffect()
      }
    }

    return <span>{studentRef}</span>
  }

  const Item = ({ name, label }) => {
    return (
      <BreadcrumbItem name={name} label={label}>
        <BreadcrumbItem name='edit' label={getStudentRef} />
        <BreadcrumbItem name='show' label={getStudentRef} />
        <BreadcrumbItem name='create' label='créer' />
      </BreadcrumbItem>
    )
  }

  return (
    <Breadcrumb>
      <Item name='students' label='Étudiants' />
      <Item name='teachers' label='Enseignants' />
      <Item name='profile' label='Profiles' />
      <Item name='fees' label='Frais' />
      <Item name='courses' label='Cours' />
      <BreadcrumbItem name='grades' label='Notes' />
      <BreadcrumbItem name='profile' label='Profiles' />
    </Breadcrumb>
  )
}
