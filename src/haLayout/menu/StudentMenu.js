import { SingleMenu } from '.';
import { AttachMoney, Receipt } from '@mui/icons-material'
import authProvider from '../../providers/authProvider';

function StudentMenu(){
  const whoamiId = authProvider.getCachedWhoami().id

  return (
    <>
      <SingleMenu to={whoamiId ? `/students/${authProvider.getCachedWhoami().id}/fees` : '/'} label='Frais' icon={<AttachMoney />} />
      <SingleMenu label='Notes' icon={<Receipt />} />
    </>
  )
}

export default StudentMenu
