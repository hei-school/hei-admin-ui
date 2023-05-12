import { useRecordContext, Create } from 'react-admin'
import { useState } from 'react'
import CourseForm from './CourseForm'

const CourseCreate = () => {
  const [course, setCourse] = useState(null)
  const AddCourse = () => {
    const record = useRecordContext()
    if (!record) return null
    return <>{setCourse(record)}</>
  }
  return (
    <Create>
      <AddCourse />
      <CourseForm course={course} />
    </Create>
  )
}

export default CourseCreate
