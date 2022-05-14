import Money from '@material-ui/icons/AttachMoney'
import FeeList from './FeeList'
import ByStatusFeeList from './ByStatusFeeList'
import FeeShow from './FeeShow'
import FeesCreate from './FeesCreate'

const fees = {
  list: FeeList,
  listByStatus: ByStatusFeeList,
  show: FeeShow,
  create: FeesCreate,
  icon: Money,
  options: { label: 'Frais' }
}

export default fees
