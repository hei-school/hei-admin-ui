import { Layout } from '@react-admin/ra-enterprise'
import { AppLocationContext } from '@react-admin/ra-navigation'
import { HaBreadcrumb } from './HaBreadcrumb'

import HaMenu from './menu/HaMenu'

const HaLayout = props => (
  <AppLocationContext>
    <Layout {...props} appBar={() => null} menu={HaMenu} breadcrumb={HaBreadcrumb} />
  </AppLocationContext>
)

export default HaLayout
