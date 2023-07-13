import { ExamDetail, ExamInfo } from 'src/gen/haClient'

// all exams
export const exam1: ExamInfo = {
  id: 'Exam1_id',
  coefficient: 2,
  title: 'premier control',
  examination_date: '2023-05-17T10:42:13.145Z'
}
export const exam2: ExamInfo = {
  id: 'Exam2_id',
  coefficient: 3,
  title: 'second exam',
  examination_date: '2023-06-17T10:00:13.145Z'
}
export const updatedExam: ExamInfo = {
  id: 'Exam1_id',
  coefficient: 4,
  title: 'first exam',
  examination_date: '2023-06-17T10:00:13.145Z'
}
export const createExam = (title: string, coefficient: number, examination_date: string): ExamInfo => {
  return {
    coefficient: coefficient,
    title: title,
    examination_date: new Date(examination_date).toISOString()
  }
}

// all examdetails
export const exam1Details: ExamDetail = {
  participants: [
    {
      id: 'student1',
      ref: 'STD000001',
      first_name: 'One',
      last_name: 'Student',
      email: 'one@gmail.com',
      grade: {
        score: 12.5,
        created_at: '2023-05-23T06:46:26.853Z'
      }
    },
    {
      id: 'student2',
      ref: 'STD000002',
      first_name: 'Two',
      last_name: 'Student',
      email: 'two@gmail.com',
      grade: {
        score: 13,
        created_at: '2023-05-23T06:46:26.853Z'
      }
    }
  ],
  ...exam1
}
export const exam2Details: ExamDetail = {
  participants: [],
  ...exam2
}
export const updatedExamDetails: ExamDetail = {
  ...updatedExam,
  participants: [...exam1Details?.participants!]
}
export const exam1updatedGrades: ExamDetail = {
  participants: [
    {
      id: 'student1',
      ref: 'STD000001',
      first_name: 'One',
      last_name: 'Student',
      email: 'one@gmail.com',
      grade: {
        score: 14,
        created_at: '2023-05-23T06:46:26.853Z'
      }
    },
    {
      id: 'student2',
      ref: 'STD000002',
      first_name: 'Two',
      last_name: 'Student',
      email: 'two@gmail.com',
      grade: {
        score: 13,
        created_at: '2023-05-23T06:46:26.853Z'
      }
    }
  ],
  ...exam1
}
//all course exam list
export const course1exams: ExamInfo[] = [
  exam1,
  {
    id: 'Exam2_id',
    coefficient: 3,
    title: 'second exam',
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
