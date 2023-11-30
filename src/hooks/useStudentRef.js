import { useState } from 'react'
import { useDataProvider } from 'react-admin'
import { useParams } from 'react-router-dom'
import { studentIdFromRaId } from '../providers/feeProvider'

export const useStudentRef = source => {
  const params = useParams()
  const dataProvider = useDataProvider()
  const studentId = studentIdFromRaId(params[source])
  const [studentRef, setStudentRef] = useState('...')

  const fetchRef = async () => {
    const student = await dataProvider.getOne('students', { id: studentId })
    setStudentRef(student.data.ref)
  }

  return { studentRef, fetchRef, studentId, baseId: params[source] }
}
