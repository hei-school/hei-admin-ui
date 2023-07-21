import { useEffect, useState } from 'react'

import { Datagrid, TextField, useDataProvider, useListContext } from 'react-admin'

import { List } from '@react-admin/ra-rbac'

import authProvider from '../../providers/authProvider'
import { CustomDateField } from '../utils'

const GradeList = () => {
  const studentId = authProvider.getCachedWhoami().id
  const [studentRef, setStudentRef] = useState('...')
  const dataProvider = useDataProvider()
  useEffect(() => {
    const doEffect = async () => {
      const student = await dataProvider.getOne('students', { id: studentId })
      setStudentRef(student.data.ref)
    }
    doEffect()
  }, [studentId])
  return (
    <List title={`Liste des notes de ${studentRef}`} resource='grades' filterDefaultValues={{ studentId: studentId }} pagination={false}>
      <Grade />
    </List>
  )
}

const Grade = () => {
  const [examsData, setExamsData] = useState([])
  const { data } = useListContext()

  useEffect(() => {
    let newExamData = []
    data?.forEach(course => {
      course.exams?.forEach(exam => {
        newExamData = [
          ...newExamData,
          {
            courseName: course.name,
            id: exam.id,
            title: exam.title,
            coefficient: exam.coefficient,
            examinationDate: exam.examination_date,
            grade: exam.grade.score
          }
        ]
      })
    })
    setExamsData(newExamData)
  }, [data])
  return (
    <Datagrid bulkActionButtons={false} data={examsData}>
      <TextField source='courseName' label='Cours' />
      <TextField source='title' label='Titre' />
      <TextField source='coefficient' label='Coefficient' />
      {CustomDateField({ source: 'examinationDate', label: "Date et heure d'examen", showTime: true })}
      <TextField source='grade' label='Point ' />
    </Datagrid>
  )
}

export default GradeList
