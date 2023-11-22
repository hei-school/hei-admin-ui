import { Show } from 'react-admin'
import { ProfileLayout } from '../profile/ProfileShow'

const ScannerShow = () => {
  return (
    <Show title='Enseignants' actions={<ActionsOnShow />}>
      <ProfileLayout />
    </Show>
  )
}

export default ScannerShow
