import ExamCreate from './ExamCreate'
import ExamList from './ExamList'
import ExamShow from './ExamShow'

const exams = {
  show: ExamShow,
  list: ExamList,
  create: ExamCreate,
  options: { label: 'Examens' }
}

export default exams
