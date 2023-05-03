import { List } from '@react-admin/ra-rbac'
import { Datagrid, FunctionField, TextField, useDataProvider, useListContext } from 'react-admin'
import { useParams } from 'react-router-dom'
import { WhoamiRoleEnum } from '../../gen/haClient'
import authProvider from '../../providers/authProvider'
import { useEffect, useState } from 'react'
import { CustomDateField, PrevNextPagination, pageSize, unexpectedValue } from '../utils'

const GradeList = ({ studentId }) => {
  const params = useParams()
  const definedStudentId = studentId ? studentId : params.studentId
  const [studentRef, setStudentRef] = useState('...')
  const dataProvider = useDataProvider()
  const role = authProvider.getCachedRole()
  useEffect(() => {
    const doEffect = async () => {
      const student = await dataProvider.getOne('students', { id: definedStudentId })
      setStudentRef(student.data.ref)
    }
    doEffect()
    // eslint-disable-next-line
  }, [definedStudentId])
  //TurnsStringIntoDate
  const transformData = response => {
    const transformedData = response.data.map(examen => ({
      codes: `herilala`
    }))
    console.log(response)
    return {
      ...response,
      data: [
        { id: 'dfze', code2: `herilala` },
        { id: 'ffff', code2: `herilala` }
      ]
    }
  }
  return (
    <List
      title={'Liste des notes de ' + studentRef}
      label='fff'
      resource={'grades'}
      filterDefaultValues={{ studentId: definedStudentId }}
      perPage={pageSize}
      pagination={<PrevNextPagination />}
    >
      <Grade />
    </List>
  )
}

const Grade = () => {
  const { data } = useListContext()
  const [examsData, setExamsDate] = useState([])
  const dateRenderer = studentCourseExam => {
    return <div>{studentCourseExam.examinationDate}</div>
  }
  const gradeRenderer = studentCourseExam => {
    return <div>{studentCourseExam.exams[0].grade.score}</div>
  }
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
