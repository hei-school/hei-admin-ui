import { Breadcrumb, BreadcrumbItem } from '@react-admin/ra-navigation'
import { useState } from 'react'
import dataProvider from '../../../providers/dataProvider'

export const HaBreadCrumb = () => {
  const [studentRef, setStudentRef] = useState('...')

  const getRef = ({ record }) => {
    if (record && record.student_id && !record.ref) {
      const student = async () => dataProvider.getOne('students', { id: record.student_id })
      setStudentRef(student.data.ref)
    }
    return <span>{record?.ref || studentRef}</span>
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
      childBreadCrumb: { ...typicalBreadCrumb }
    },
    {
      name: 'teachers',
      label: 'Enseignants',
      childBreadCrumb: { ...typicalBreadCrumb }
    },
    {
      name: 'fees',
      label: 'Frais',
      childBreadCrumb: { ...typicalBreadCrumb }
    },
    {
      name: 'profile',
      label: 'Profil',
      childBreadCrumb: {}
    },
    {
      name: 'groups',
      label: 'Groupes',
      childBreadCrumb: { ...typicalBreadCrumb }
    },
    {
      name: 'payments',
      label: 'Paiement',
      childBreadCrumb: { create: 'Créer' }
    }
  ]
  return (
    <Breadcrumb>
      {breadCrumbs.map(({ name, label, childBreadCrumb }) => (
        <BreadcrumbItem key={name} name={name} label={label}>
          {Object.entries(childBreadCrumb).map(([name, label]) => (
            <BreadcrumbItem key={name} name={name} label={label} />
          ))}
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  )
}
