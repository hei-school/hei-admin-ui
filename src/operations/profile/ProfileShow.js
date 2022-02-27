import React, { useState, useEffect } from 'react'
import { DateField, EmailField, FunctionField, SimpleShowLayout, Show, TextField } from 'react-admin'
import { Typography } from '@material-ui/core'

import { useAsync } from 'react-async'
import authProvider from '../../providers/authProvider'

const ChangeRequest = () => (
  <div style={{ width: 200, margin: '1em' }}>
    <Typography variant='h6'>Un changement ?</Typography>
    <Typography variant='body2'>
      Signalez-le immédiatement à <a href='mailto:contact@hei.school'>contact@hei.school</a> avec les justificatifs associés
    </Typography>
  </div>
)

export const ProfileLayout = () => {
  const withRedWarning = text => <span style={{ color: 'red', fontWeight: 'bold' }}>{text}</span>
  const unexpectedValue = withRedWarning('?')
  const sexRenderer = user => {
    if (user.sex === 'M') return 'Homme'
    if (user.sex === 'F') return 'Femme'
    return unexpectedValue
  }
  const statusRenderer = user => {
    if (user.status === 'ENABLED') return 'Actif·ve'
    if (user.status === 'DISABLED') return 'Suspendu·e'
    return unexpectedValue
  }
  return (
    <SimpleShowLayout>
      <TextField source='ref' label='Référence' />
      <TextField source='first_name' label='Prénom(s)' />
      <TextField source='last_name' label='Nom(s)' />
      <FunctionField label='Sexe' render={sexRenderer} />
      <TextField label='Téléphone' source='phone' />
      <DateField source='birth_date' label='Date de naissance' />
      <TextField source='address' label='Adresse' component='pre' />
      <EmailField source='email' label='Email' />
      <DateField source='entrance_datetime' label="Date d'entrée chez HEI" />
      <FunctionField label='Statut' render={statusRenderer} />
    </SimpleShowLayout>
  )
}

const ProfileShow = () => {
  const [id, setId] = useState()
  const { data, isPending } = useAsync({ promiseFn: authProvider.whoami })
  useEffect(() => {
    if (!isPending && data) {
      setId(data.id)
    }
  }, [isPending, data])

  return id ? (
    <Show id={id} aside={<ChangeRequest />} resource='profile' basePath='/profile' title='Mon profil'>
      <ProfileLayout />
    </Show>
  ) : (
    <></>
  )
}

export default ProfileShow
