import { AttachMoney } from '@mui/icons-material'
import PaymentList from './PaymentList'
import PaymentCreate from './PaymentCreate'

const payments = {
  list: PaymentList,
  create: PaymentCreate,
  icon: AttachMoney,
  options: { label: 'Paiements' }
}

export default payments
