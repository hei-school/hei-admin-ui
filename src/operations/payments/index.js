import Money from '@material-ui/icons/AttachMoney'
import PaymentList from './PaymentList'
import PaymentCreate from './PaymentCreate'

const payments = {
  list: PaymentList,
  create: PaymentCreate,
  icon: Money,
  options: { label: 'Paiements' }
}

export default payments
