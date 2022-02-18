import React from 'react'
import { Login } from 'react-admin'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import { Typography } from '@material-ui/core'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { mainTheme } from './haTheme'
import CompletePasswordPage from './operations/security/CompletePasswordPage'
import authProvider from './providers/authProvider'

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
  const displayFull = useMediaQuery('(min-width:1024px) and (min-height:768px)')
  const ResponsiveLogin = () => <Login backgroundImage={null} style={{ backgroundImage: 'inherit' }} />
  const ResponsiveCompletePassword = () => <CompletePasswordPage style={{ backgroundImage: 'inherit' }} />
  const PasswordChangeableLogin = () => (authProvider.isTemporaryPassword() ? <ResponsiveCompletePassword /> : <ResponsiveLogin />)

  return (
    <div
      style={{
        backgroundImage: 'url(/login-bg.jpg)',
        backgroundSize: 'cover',
        position: 'fixed',
        padding: '0',
        margin: '0',
        width: '100%',
        height: '100%'
      }}
    >
      {displayFull ? (
        <Grid container spacing={2} style={{ paddingTop: '10%' }} theme={mainTheme}>
          <Grid item xs={4}>
            <Typography variant='h3' align='center'>
              <div style={{ color: '#ffc107' }}>HEI</div>
            </Typography>
            <Typography variant='h7' align='center'>
              <div style={{ color: '#ffffff' }}>Une scolarité qui passe à l'échelle</div>
            </Typography>{' '}
            <PasswordChangeableLogin />
          </Grid>
          <Grid item xs={8}>
            <Grid container spacing={1}>
              <Grid item xs={1} />
              <Grid item xs={5}>
                {aCard('0', "Coût à l'arrêt", 'Personne ne se connecte ?', 'Alors personne ne paie.', 'SYS-2')}
              </Grid>
              <Grid item xs={4}>
                {aCard('0', 'Vulnérabilité', 'Crashtest nous scanne,', 'mais ne trouve rien !', 'WEB-2')}
              </Grid>
              <Grid item xs={2} />

              <Grid item xs={1} />
              <Grid item xs={5}>
                {aCard('250,000,000', 'Utilisateurs', 'Onboarder tout Madagascar ?', 'Dix fois sans problème.', 'DONNEES-2')}
              </Grid>
              <Grid item xs={4}>
                {aCard('1', 'Seconde', 'Pire réponse de notre API', 'au percentile 97.', 'PROG-2')}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <PasswordChangeableLogin />
      )}
    </div>
  )
}

export default HaLoginPage
