import Money from '@material-ui/icons/AttachMoney'
import { ListGuesser, EditGuesser, ShowGuesser } from 'react-admin'

const fees = {
  list: ListGuesser,
  edit: EditGuesser,
  show: ShowGuesser,
  icon: Money,
  options: { label: 'Frais' }
}

export default fees
