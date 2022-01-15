import { Layout } from 'react-admin'
import HaAppBar from './HaAppBar'
import HaMenu from './HaMenu'

const HaLayout = props => {
  return <Layout {...props} appBar={HaAppBar} menu={HaMenu} />
}

export default HaLayout
