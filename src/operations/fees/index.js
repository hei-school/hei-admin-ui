import Money from '@material-ui/icons/AttachMoney'
import FeeList from './FeeList'
import FeeShow from './FeeShow'
import FeesCreate from './FeesCreate'

const fees = {
  list: FeeList,
  show: FeeShow,
  create: FeesCreate,
  icon: Money,
  options: { label: 'Frais' }
}

export default fees
