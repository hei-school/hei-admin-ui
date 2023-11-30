import { AttachMoney } from '@mui/icons-material'
import FeeList from './FeeList'
import ByStatusFeeList from './ByStatusFeeList'
import FeeShow from './FeeShow'
import FeesCreate from './FeesCreate'
import FeeEdit from './FeeEdit'

const fees = {
  list: FeeList,
  listByStatus: ByStatusFeeList,
  show: FeeShow,
  create: FeesCreate,
  edit: FeeEdit,
  icon: AttachMoney,
  options: { label: 'Frais' }
}

export default fees
