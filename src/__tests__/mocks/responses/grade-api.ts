import { StudentCourseExam } from 'src/gen/haClient'

export const grade1Mock: StudentCourseExam = {
  id: 'cours1',
  code: 'PROG1',
  name: 'Algorithmics',
  credits: 1,
  total_hours: 6,
  //TODO: have to have main_teacher: "string",
  exams: [
    {
      id: 'exam_1_1',
      coefficient: 1,
      title: 'string',
      examination_date: '2023-04-26T12:32:50.645Z',
      grade: {
        score: 19.5,
        created_at: '2023-04-26T12:32:50.645Z'
      }
    }
  ]
}

export const gradesMock: StudentCourseExam[] = [
  grade1Mock,
  {
    id: 'Course2_id',
    code: 'Données2',
    credits: 5,
    name: 'Données L2',
    total_hours: 25,
    //TODO: have to have main_teacher: "string",
    exams: [
      {
        id: 'exam_2_1',
        coefficient: 2,
        title: 'string',
        examination_date: '2023-04-26T12:32:50.645Z',
        grade: {
          score: 12.5,
          created_at: '2023-04-28T12:32:50.645Z'
        }
      }
    ]
  },
  {
    id: 'cours1',
    code: 'PROG1',
    name: 'Algorithmics',
    credits: 10,
    total_hours: 10,
    //TODO: have to have main_teacher: "string",
    exams: [
      {
        id: 'exam_3_1',
        coefficient: 5,
        title: 'first',
        examination_date: '2023-04-26T12:32:50.645Z',
        grade: {
          score: 14.5,
          created_at: '2023-04-27T12:32:50.645Z'
        }
      },
      {
        id: 'exam_3_2',
        coefficient: 5,
        title: 'examen final',
        examination_date: '2023-04-26T12:32:50.645Z',
        grade: {
          score: 14.5,
          created_at: '2023-04-27T12:32:50.645Z'
        }
      }
    ]
  }
]
