import { AttachMoney } from '@mui/icons-material'
import FeeList from './FeeList'
import ByStatusFeeList from './ByStatusFeeList'
import FeeShow from './FeeShow'
import FeesCreate from './FeesCreate'

const fees = {
  list: FeeList,
  listByStatus: ByStatusFeeList,
  show: FeeShow,
  create: FeesCreate,
  icon: AttachMoney,
  options: { label: 'Frais' }
}

export default fees
