import { useListContext, TopToolbar, CreateButton, ExportButton } from 'react-admin'

import authProvider from '../../providers/authProvider'

const PermittedListActions = props => {
  const { total, isLoading } = useListContext()
  const permission = authProvider.getCachedRole()
  return (
    <TopToolbar>
      {permission === 'MANAGER' && <CreateButton {...props} />}
      <ExportButton {...props} disabled={isLoading || total === 0} />
    </TopToolbar>
  )
}

export default PermittedListActions
