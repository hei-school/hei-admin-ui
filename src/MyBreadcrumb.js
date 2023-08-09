import { Breadcrumb, BreadcrumbItem } from '@react-admin/ra-navigation'
import { useState } from 'react'
import { Color } from './utils/color'
import dataProvider from './providers/dataProvider'
import { useRecordContext } from 'react-admin'

const sxProps = {
  bgcolor: Color['500'],
  height: '5rem',
  mt: 1,
  borderRadius: '4px',
  border: '1px solid #f4f4f4',
  p: 2,
  '& li': {
    '& span': {
      color: 'white'
    },
    '&::before': {
      color: 'white'
    }
  },
  '& li:nth-child(1) > span': {
    fontWeight: 'bold'
  }
}

export const MyBreadcrumb = () => {
  const [displayLabel, setDisplayLabel] = useState('')
  const std = useRecordContext()

  const queryLabel = ({ record }, key = 'ref') => {
    console.log('students', std)

    let label = record[key]
    ;(async function () {
      // if it has no ref, it is likely a fee record
      // fetch the associated student
      if (!label) {
        const { student_id } = record
        label = (await dataProvider.getOne('students', { id: student_id })).data.ref
      }
      setDisplayLabel(label)
    })()
    return displayLabel
  }

  return (
    <Breadcrumb sx={sxProps}>
      <BreadcrumbItem name='students' label='Étudiants'>
        <BreadcrumbItem name='show' label={queryLabel} />
        <BreadcrumbItem name='edit' label={queryLabel} />
        <BreadcrumbItem name='create' label='Créer' />
      </BreadcrumbItem>
      <BreadcrumbItem name='teachers' label='Enseignants'>
        <BreadcrumbItem name='edit' label={queryLabel} />
        <BreadcrumbItem name='show' label={queryLabel} />
        <BreadcrumbItem name='create' label='Créer' />
      </BreadcrumbItem>
      <BreadcrumbItem name='fees' label='Frais'>
        <BreadcrumbItem name='edit' label={queryLabel} />
        <BreadcrumbItem name='show' label={queryLabel} />
        <BreadcrumbItem name='create' label='Créer' />
      </BreadcrumbItem>
      <BreadcrumbItem name='profile' label='Profile' />
    </Breadcrumb>
  )
}
