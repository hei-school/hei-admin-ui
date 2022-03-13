import Money from '@material-ui/icons/AttachMoney'
import FeeList from './FeeList'
import FeeShow from './FeeShow'
import { EditGuesser } from 'react-admin'

const fees = {
  list: FeeList,
  edit: EditGuesser,
  show: FeeShow,
  icon: Money,
  options: { label: 'Frais' }
}

export default fees
