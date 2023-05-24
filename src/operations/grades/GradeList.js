import { List } from '@react-admin/ra-rbac'
import { Datagrid, TextField, useDataProvider, useListContext } from 'react-admin'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { CustomDateField } from '../utils'

const GradeList = ({ studentId }) => {
  const params = useParams()
  const definedStudentId = studentId ? studentId : params.studentId
  const [studentRef, setStudentRef] = useState('...')
  const dataProvider = useDataProvider()
  useEffect(() => {
    const doEffect = async () => {
      const student = await dataProvider.getOne('students', { id: definedStudentId })
      setStudentRef(student.data.ref)
    }
    doEffect()
    // eslint-disable-next-line
  }, [definedStudentId])
  //TurnsStringIntoDate
  return (
    <List title={'Liste des notes de ' + studentRef} label='fff' resource={'grades'} filterDefaultValues={{ studentId: definedStudentId }} pagination={false}>
      <Grade />
    </List>
  )
}

const Grade = () => {
  const { data } = useListContext()
  const [examsData, setExamsDate] = useState([])
  useEffect(() => {
    setExamsDate([])
    data?.forEach(course => {
      course.exams?.forEach(exam => {
        setExamsDate([
          ...examsData,
          {
            courseName: course.name,
            id: exam.id,
            title: exam.title,
            coefficient: exam.coefficient,
            examinationDate: exam.examination_date,
            grade: exam.grade.score
          }
        ])
      })
    })
  }, [data])
  return (
    <Datagrid bulkActionButtons={false} data={examsData}>
      <TextField source='courseName' label='cours' />
      <TextField source='title' label='titre' />
      <TextField source='coefficient' label='coéfficient' />
      {CustomDateField({ source: 'examinationDate', label: "Date et heure d'examen", showTime: true })}
      <TextField source='grade' label='Point ' />
    </Datagrid>
  )
}

export default GradeList
