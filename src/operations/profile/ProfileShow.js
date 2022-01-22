import { DateField, EmailField, FunctionField, SimpleShowLayout, Show, TextField } from 'react-admin'
import { Typography } from '@material-ui/core'

import { useAsync } from 'react-async'
import { useState, useEffect } from 'react'
import authProvider from '../../providers/authProvider'

const ChangeRequest = () => (
  <div style={{ width: 200, margin: '1em' }}>
    <Typography variant='h6'>Un changement ?</Typography>
    <Typography variant='body2'>
      Signalez-le immédiatement à <a href='mailto:contact@hei.school'>contact@hei.school</a> avec les justificatifs associés
    </Typography>
  </div>
)

const getPermission = async ({ authProvider }) => {
  return await authProvider.getUserInformations()
}

const ProfileShow = () => {
  const [id, setId] = useState()
  const { data, isPending } = useAsync({ promiseFn: getPermission, authProvider: authProvider })
  useEffect(() => {
    if (!isPending && data) {
      setId(data.id)
    }
  }, [isPending, data])

  if (!id) {
    return <></>
  }
  const withRedWarning = text => <span style={{ color: 'red', fontWeight: 'bold' }}>{text}</span>
  const unexpectedValue = withRedWarning('?')
  const sexRenderer = user => (user.sex === 'M' ? 'Homme' : user.sex === 'F' ? 'Femme' : unexpectedValue)
  const statusRenderer = user => (user.status === 'ENABLED' ? 'Actif·ve' : user.status === 'DISABLED' ? withRedWarning('Suspendu·e') : unexpectedValue)
  return (
    <Show id={id} aside={<ChangeRequest />} resource='profile' basePath='/profile' title='Mon profil'>
      <SimpleShowLayout record={{ sex: 'Homme' }}>
        <TextField source='ref' label='Référence' />
        <TextField source='first_name' label='Prénom(s)' />
        <TextField source='last_name' label='Nom(s)' />
        <FunctionField label='Sexe' render={sexRenderer} />
        <DateField source='birth_date' label='Date de naissance' />
        <TextField source='address' label='Adresse' />
        <EmailField source='email' label='Email' />
        <DateField source='entrance_datetime' label="Date d'entrée chez HEI" />
        <FunctionField label='Statut' render={statusRenderer} />
      </SimpleShowLayout>
    </Show>
  )
}

export default ProfileShow
