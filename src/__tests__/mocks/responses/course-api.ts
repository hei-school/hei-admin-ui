import { Course } from 'src/gen/haClient'
import { teacher1Mock, teachersMock } from './teacher-api'

export const courseNameToBeCheckedMock = 'Donnees_L1'

export const course1Mock: Course = {
  id: 'Course1_id',
  code: 'Données1',
  credits: 5,
  name: courseNameToBeCheckedMock,
  total_hours: 5,
  main_teacher: teacher1Mock
}
export const course1EditMock: Course = {
  id: course1Mock.id,
  code: `${course1Mock.code} Edit`,
  credits: 10,
  name: `${course1Mock.name} Edit`,
  total_hours: 10,
  main_teacher: teachersMock[2]
}

export const courseCreatedMock: Course = {
  id: 'CourseCreatedId',
  code: 'PROG5',
  credits: 10,
  name: 'Logical course',
  total_hours: 50,
  main_teacher: teacher1Mock
}

export const coursesMock: Course[] = [
  course1Mock,
  {
    id: 'Course2_id',
    code: 'Données2',
    credits: 5,
    name: 'Données L2',
    total_hours: 5,
    main_teacher: teacher1Mock
  },
  {
    id: 'Course3_id',
    code: 'Données3',
    credits: 6,
    name: 'Données',
    total_hours: 5,
    main_teacher: teachersMock[2]
  },
  {
    id: 'Course4_id',
    code: 'Données4',
    credits: 1,
    name: 'MCD',
    total_hours: 5,
    main_teacher: teachersMock[3]
  },
  {
    id: 'Course5_id',
    code: 'Données5',
    credits: 1,
    name: 'MLD',
    total_hours: 5,
    main_teacher: teachersMock[4]
  },
  {
    id: 'Course6_id',
    code: 'Données1',
    credits: 6,
    name: 'Select',
    total_hours: 5,
    main_teacher: teachersMock[5]
  },
  {
    id: 'Course7_id',
    code: 'Données6',
    credits: 2,
    name: 'Viue',
    total_hours: 5,
    main_teacher: teacher1Mock
  },
  {
    id: 'Course8_id',
    code: 'Données1',
    credits: 2,
    name: 'Données L3',
    total_hours: 5,
    main_teacher: teachersMock[7]
  },
  {
    id: 'Course9_id',
    code: 'Données7',
    credits: 2,
    name: 'Données L3',
    total_hours: 5,
    main_teacher: teacher1Mock
  },
  {
    id: 'Course10_id',
    code: 'Données8',
    credits: 5,
    name: 'Données L3',
    total_hours: 5,
    main_teacher: teachersMock[9]
  }
]

export const filterCourseByNameMock: Course[] = coursesMock.filter(e => e.name === courseNameToBeCheckedMock)
