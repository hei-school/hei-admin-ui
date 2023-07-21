import { Layout } from '@react-admin/ra-enterprise'
import { AppLocationContext } from '@react-admin/ra-navigation'

import HaAppBar from './HaAppBar'
import { HaPathGuide } from './HaPathGuide'
import HaMenu from './menu/HaMenu'

const HaLayout = props => (
  <AppLocationContext>
    <Layout {...props} appBar={HaAppBar} menu={HaMenu} breadcrumb={HaPathGuide} />
  </AppLocationContext>
)

export default HaLayout
