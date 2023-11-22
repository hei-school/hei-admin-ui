import { Show } from 'react-admin'
import { ProfileLayout } from '../profile/ProfileShow'
import { ActionsOnShow } from '../utils'

const ScannerShow = () => {
  return (
    <Show title='Scanners' actions={<ActionsOnShow />} resource='scanners'>
      <ProfileLayout />
    </Show>
  )
}

export default ScannerShow
