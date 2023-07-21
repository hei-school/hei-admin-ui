import { AttachMoney } from '@mui/icons-material'

import ByStatusFeeList from './ByStatusFeeList'
import FeeList from './FeeList'
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
