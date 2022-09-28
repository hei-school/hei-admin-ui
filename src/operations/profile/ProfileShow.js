import {DateField, EmailField, FunctionField, Show, SimpleShowLayout, TextField} from 'react-admin'

import authProvider from '../../providers/authProvider'
import femme from '../../image/imageFemme.jpg';

import {unexpectedValue} from '../utils/typography'
import Grid from "@material-ui/core/Grid";

export const ProfileLayout = () => {
    const role = authProvider.getCachedRole()
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
        <Grid container spacing={2}>
            <Grid item xs={7}>
                <SimpleShowLayout>
                    <TextField source='ref' label='Référence'/>
                    <TextField source='first_name' id='first_name' label='Prénom(s)'/>
                    <TextField source='last_name' label='Nom(s)'/>
                    <FunctionField label='Sexe' render={sexRenderer}/>
                    <TextField label='Téléphone' source='phone'/>
                    <DateField source='birth_date' label='Date de naissance' locales='fr-FR'
                               options={{year: 'numeric', month: 'long', day: 'numeric'}}/>
                    <TextField source='address' label='Adresse' component='pre'/>
                    <EmailField source='email' label='Email'/>
                    <DateField source='entrance_datetime' label="Date d'entrée chez HEI" locales='fr-FR'
                               options={{year: 'numeric', month: 'long', day: 'numeric'}}/>
                    <FunctionField label='Statut' render={statusRenderer}/>
                </SimpleShowLayout>
            </Grid>
            {role === 'STUDENT' ?
                <Grid item xs={5} sx={{
                padding: "5vw"
                }}>
                    <SimpleShowLayout>
                        <img src={femme} alt="image of a student" style={{width: "25vw", height: "57vh", margin: "5vw"}}/>
                    </SimpleShowLayout>
                </Grid> : null
            }
        </Grid>
    )
}

const ProfileShow = () => {
    const id = authProvider.getCachedWhoami().id
    return (
        <Show id={id} resource='profile' basePath='/profile' title='Mon profil'>
            <ProfileLayout/>
        </Show>
    )
}

export default ProfileShow
