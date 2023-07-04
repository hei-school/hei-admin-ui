import ExamCreate from './ExamCreate'
import ExamEdit from './ExamEdit'
import ExamList from './ExamList'
import ExamShow from './ExamShow'

const exams = {
  show: ExamShow,
  list: ExamList,
  edit: ExamEdit,
  create: ExamCreate,
  options: { label: 'Examens' }
}

export default exams
