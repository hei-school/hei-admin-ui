import { ExamInfo } from 'src/gen/haClient'

export const examInfo1Mock: ExamInfo = {
  id: 'Exam1_id',
  coefficient: 2,
  title: 'premier control',
  examination_date: '2023-05-17T10:42:13.145Z'
}

export const course1ExamInfosMock: ExamInfo[] = [
  examInfo1Mock,
  {
    id: 'Exam2_id',
    coefficient: 3,
    title: 'premier control',
    examination_date: '2023-06-17T10:00:13.145Z'
  },
  {
    id: 'Exam3_id',
    coefficient: 9,
    title: 'control surprise',
    examination_date: '2023-07-17T10:30:13.145Z'
  },
  {
    id: 'Exam4_id',
    coefficient: 1,
    title: 'Examen fina',
    examination_date: '2023-08-17T10:30:13.145Z'
  }
]
