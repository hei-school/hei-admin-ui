import React from 'react'
import { Login } from 'react-admin'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import { Typography } from '@material-ui/core'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { mainTheme } from './haTheme'

const aCard = (title, subtitle, description1, description2, course) => {
  const syllabus = 'https://drive.google.com/file/d/12Lc4o3jfQOFHIzazPToO2hnGZc8epU3I/view'
  return (
    <Card style={{ backgroundColor: '#ffffff', opacity: 0.9 }}>
      <CardContent>
        <Typography variant='h3' color='primary'>
          {title}
        </Typography>
        <Typography variant='h5' color='primary'>
          {subtitle}
        </Typography>
        <Typography variant='h7' color='initial'>
          {description1}
          <br />
          {description2}
        </Typography>
        <Typography variant='h8' color='initial'>
          <p>
            Cours :{' '}
            <a href={syllabus} style={{ color: '#000000' }}>
              {course}
            </a>
          </p>
        </Typography>
      </CardContent>
    </Card>
  )
}

const HaLoginPage = () => {
  const displayFull = useMediaQuery('(min-width:1500px)')
  return displayFull ? (
    <Grid container spacing={2} style={{ paddingTop: '10%', backgroundImage: 'url(/login-bg.jpg)' }} theme={mainTheme}>
      <Grid item xs={4}>
        <Typography variant='h3' align='center'>
          <div style={{ color: '#ffc107' }}>HEI</div>
        </Typography>
        <Typography variant='h7' align='center'>
          <div style={{ color: '#ffffff' }}>Une scolarité qui passe à l'échelle</div>
        </Typography>{' '}
        <Login backgroundImage={null} style={{ backgroundImage: 'inherit' }} />
      </Grid>
      <Grid item xs={8}>
        <Grid container spacing={3}>
          <Grid item xs={2} />
          <Grid item xs={4}>
            {aCard('0', "Coût à l'arrêt", 'Personne ne se connecte ?', 'Alors personne ne paie.', 'SYS-2')}
          </Grid>
          <Grid item xs={3}>
            {aCard('0', 'Vulnérabilité', 'Crashtest nous scanne,', 'mais ne trouve rien !', 'WEB-2')}
          </Grid>
          <Grid item xs={3} />

          <Grid item xs={2} />
          <Grid item xs={4}>
            {aCard('250,000,000', 'Utilisateurs', 'Onboarder tout Madagascar ?', 'Dix fois sans problème.', 'DONNEES-2')}
          </Grid>
          <Grid item xs={3}>
            {aCard('1', 'Seconde', 'Pire réponse de notre API', 'au percentile 97.', 'PROG-2')}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  ) : (
    <Login backgroundImage='/login-bg.jpg' />
  )
}

export default HaLoginPage
