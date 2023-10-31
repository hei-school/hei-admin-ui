import { Breadcrumb, BreadcrumbItem } from '@react-admin/ra-navigation'
import { useState } from 'react'
import dataProvider from '../../../providers/dataProvider'

const HaBreadCrumb = () => {
  const [studentRef, setStudentRef] = useState('...')

  const getRef = ({ record }) => {
    if (record && record.student_id && !record.ref) {
      const student = async () => dataProvider.getOne('students', { id: record.student_id })
      setStudentRef(student.data.ref)
    }
    return <span>{record && record.ref ? record.ref : studentRef}</span>
  }
  const typicalBreadCrumb = {
    edit: getRef,
    show: getRef,
    create: 'Créer'
  }
  const breadCrumbs = [
    {
      name: 'students',
      label: 'Étudiants',
      children: { ...typicalBreadCrumb }
    },
    {
      name: 'teachers',
      label: 'Enseignants',
      children: { ...typicalBreadCrumb }
    },
    {
      name: 'fees',
      label: 'Frais',
      children: { ...typicalBreadCrumb }
    },
    {
      name: 'profile',
      label: 'Profil',
      children: {}
    },
    {
      name: 'groups',
      label: 'Groupes',
      children: { ...typicalBreadCrumb }
    },
    {
      name: 'payments',
      label: 'Paiement',
      children: { create: 'Créer' }
    }
  ]
  return (
    <Breadcrumb>
      {breadCrumbs.map(({ name, label, children }) => (
        <BreadcrumbItem key={name} name={name} label={label}>
          {Object.entries(children).map(([name, label]) => (
            <BreadcrumbItem key={name} name={name} label={label} />
          ))}
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  )
}

export default HaBreadCrumb
