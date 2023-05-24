import { Edit, useRecordContext } from 'react-admin'
import { useState } from 'react'
import CourseForm from './CourseForm'

const CourseEdit = () => {
  const [course, setCourse] = useState(null)
  const AddCourse = () => {
    const record = useRecordContext()
    if (!record) return null
    return <>{setCourse(record)}</>
  }
  const courseTransform = ({ code, name, credits, total_hours }) => {
    return { id: course.id, code, name, credits, total_hours, main_teacher_id: course.main_teacher }
  }
  return (
    <Edit transform={courseTransform}>
      <AddCourse />
      <CourseForm course={course} />
    </Edit>
  )
}

export default CourseEdit
