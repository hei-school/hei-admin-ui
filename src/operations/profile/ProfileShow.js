import { EmailField, FunctionField, SimpleShowLayout, Show, TextField } from 'react-admin'
import { Link, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material'
import authProvider from '../../providers/authProvider'
import { unexpectedValue, CustomDateField } from '../utils'
import { useState } from 'react'


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
  const phoneRenderer = data => <Link href={`tel:${data.phone}`}>{data.phone}</Link>
  
  const [open, setOpen] = useState(false); // état du modal

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <SimpleShowLayout>
      <TextField source='ref' label='Référence' />
      <TextField source='first_name' id='first_name' label='Prénom(s)' />
      <TextField source='last_name' label='Nom(s)' />
      <FunctionField label='Sexe' render={sexRenderer} />
      <FunctionField label='Téléphone' render={phoneRenderer} />
      <CustomDateField source='birth_date' label='Date de naissance' showTime={false} />
      <TextField source='address' label='Adresse' component='pre' />
      <div>
        <TextField label='Localisation' />
        <Button variant="outlined" onClick={handleClickOpen}>Afficher la carte</Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Carte de la localisation</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Ici, vous pouvez afficher une carte de la localisation
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Fermer</Button>
          </DialogActions>
        </Dialog>
      </div>
      <EmailField source='email' label='Email' />
      <CustomDateField source='entrance_datetime' label="Date d'entrée chez HEI" showTime={false} />
      <FunctionField label='Statut' render={statusRenderer} />
    </SimpleShowLayout>
  )
}

const ProfileShow = () => {
  const id = authProvider.getCachedWhoami().id
  return (
    <Show id={id} resource='profile' basePath='/profile' title='Mon profil'>
      <ProfileLayout />
    </Show>
  )
}

export default ProfileShow
