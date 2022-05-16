import { useState, useEffect } from 'react'
import { DateField, EmailField, FunctionField, SimpleShowLayout, Show, TextField } from 'react-admin'

import { useAsync } from 'react-async'
import authProvider from '../../providers/authProvider'

import { unexpectedValue } from '../utils/typography'

export const ProfileLayout = () => {
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
      <TextField source='first_name' id='first_name' label='Prénom(s)' />
      <TextField source='last_name' label='Nom(s)' />
      <FunctionField label='Sexe' render={sexRenderer} />
      <TextField label='Téléphone' source='phone' />
      <DateField source='birth_date' label='Date de naissance' locales='fr-FR' />
      <TextField source='address' label='Adresse' component='pre' />
      <EmailField source='email' label='Email' />
      <DateField source='entrance_datetime' label="Date d'entrée chez HEI" locales='fr-FR' />
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
    <Show id={id} resource='profile' basePath='/profile' title='Mon profil'>
      <ProfileLayout />
    </Show>
  ) : null
}

export default ProfileShow
