import ProfileEdit from '../profile/ProfileEdit'
import ScannerShow from './ScannerShow'
import ScannerList from './ScannerList'
import ScannerCreate from './ScannerCreate'

const teachers = {
  list: ScannerList,
  edit: ProfileEdit,
  show: ScannerShow,
  create: ScannerCreate,
}

export default teachers
