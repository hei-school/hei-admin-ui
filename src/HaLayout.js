import { Layout } from 'react-admin'
import HaAppBar from './HaAppBar'
import HaMenu from './HaMenu'
import HaNotification from './HaNotification'

const HaLayout = props => {
  return <Layout {...props} appBar={HaAppBar} menu={HaMenu} notification={HaNotification} />
}

export default HaLayout
