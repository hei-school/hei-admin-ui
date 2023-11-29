import { useRef } from 'react'
import { Button, Checkbox, Dialog, DialogContent, DialogTitle, FormControlLabel, FormGroup, Grid, TextField, Typography } from '@mui/material'
import { ArrowBackIos, ArrowForwardIos } from '@material-ui/icons'
import { useWizardFormContext, WizardForm, WizardFormStep } from '@react-admin/ra-form-layout'
import { useNotify } from 'react-admin'
import { exporter, validateData } from '../utils'
import { Download, Upload } from '@mui/icons-material'
import { useForm } from 'react-hook-form'
import { EnableStatus } from 'haapi-Ts-client'
import studentProvider from '../../providers/studentProvider'
import ImportInputFile from './ImportInputFile'

const WizardToolbar = () => {
  const { hasNextStep, hasPreviousStep, goToNextStep, goToPreviousStep } = useWizardFormContext()
  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      {hasPreviousStep && (
        <Button
          onClick={() => goToPreviousStep()}
          startIcon={<ArrowBackIos />}
          style={{ display: 'flex', justifySelf: 'start' }}
          variant='contained'
          size='small'
        >
          Retour
        </Button>
      )}
      {hasNextStep && (
        <Button onClick={() => goToNextStep()} endIcon={<ArrowForwardIos />} style={{ display: 'flex', justifySelf: 'end' }} variant='contained' size='small'>
          Suivant
        </Button>
      )}
    </div>
  )
}

const defaultHeaders = [
  { id: 1, label: 'Référence (ref)', value: 'ref', disabled: true },
  { id: 2, label: 'Prénoms (first_name)', value: 'first_name', disabled: true },
  { id: 3, label: 'Nom (last_name)', value: 'last_name', disabled: true },
  { id: 4, label: 'Mail (email)', value: 'email', disabled: true },
  { id: 5, label: "Date d'entrée à HEI (entrance_datetime)", value: 'entrance_datetime', disabled: true }
]
const optionalHeaders = [
  { id: 5, label: 'Sexe (sex)', value: 'sex', disabled: false },
  { id: 6, label: 'Date de naissance (birth_date)', value: 'birth_date', disabled: false },
  { id: 8, label: 'Adresse (address)', value: 'address', disabled: false },
  { id: 9, label: 'Numéro de téléphone (phone)', value: 'phone', disabled: false }
]
export const ImportNewTemplate = ({ isOpen, toggle }) => {
  const notify = useNotify()
  const inputRef = useRef(null)
  const headers = defaultHeaders.map(header => header.value)
  const { register, handleSubmit } = useForm({
    fileName: 'template',
    importHeaders: headers
  })

  const downloadFile = data => {
    exporter([], [...headers, ...data?.importHeaders], data.fileName)
  }

  const addStudents = async (data, setData) => {
    const importValidate = validateData(data)
    if (importValidate.isValid) {
      const modifiedData = data.map(element => {
        element.entrance_datetime = new Date(element.entrance_datetime).toISOString()
        element['status'] = EnableStatus.ENABLED
      })

      setData(modifiedData)

      await studentProvider
        .saveOrUpdate(data)
        .then(() => notify(`Importation effectuée avec succès`, { type: 'success', autoHideDuration: 1000 }))
        .catch(() => notify(`L'importation n'a pas pu être effectuée`, { type: 'error', autoHideDuration: 1000 }))
    } else {
      notify(importValidate.message, { type: 'error', autoHideDuration: 1000 })
    }
  }

  return (
    <Dialog open={isOpen} onClose={toggle}>
      <DialogTitle>Importer des étudiants en 3 étapes</DialogTitle>
      <DialogContent>
        <WizardForm toolbar={<WizardToolbar />}>
          <WizardFormStep label='Fichier'>
            <Grid container padding={3} rowSpacing={5}>
              <Typography variant='body2'>
                Vous pouvez choisir le nom de votre template. Par défaut, ce sera <strong>template.xlsx</strong>
              </Typography>
              <TextField label='Nom de votre template' variant='filled' defaultValue='template' fullWidth {...register('fileName', {})} />
            </Grid>
          </WizardFormStep>
          <WizardFormStep label='En-têtes'>
            <Grid container padding={3} rowSpacing={2}>
              <Grid item>
                <Typography variant='body2'>
                  Vous pouvez aussi personnaliser les en-têtes. Les en-têtes déjà cochées sont obligatoires.
                  <br />
                  Il ne vous restera plus qu'à appuyez sur le bouton <strong>TÉLÉCHARGER</strong> et modifier votre template.
                </Typography>
              </Grid>
              <Grid item>
                <FormGroup>
                  {defaultHeaders.map(head => (
                    <FormControlLabel
                      key={head.id}
                      control={<Checkbox size='small' disabled={head.disabled} checked {...register('importHeaders', {})} />}
                      value={head.value}
                      label={<Typography variant='body2'>{head.label}</Typography>}
                    />
                  ))}
                  {optionalHeaders.map(head => (
                    <FormControlLabel
                      key={head.id}
                      control={<Checkbox size='small' {...register('importHeaders', {})} />}
                      value={head.value}
                      label={<Typography variant='body2'>{head.label}</Typography>}
                    />
                  ))}
                </FormGroup>
                <Button onClick={handleSubmit(downloadFile)} startIcon={<Download />} size='medium' variant='outlined'>
                  Télécharger
                </Button>
              </Grid>
            </Grid>
          </WizardFormStep>
          <WizardFormStep label='Importation'>
            <Grid container padding={3} rowSpacing={5}>
              <Grid item>
                <Typography variant='body2'>
                  Ça y est? Après avoir vérifié votre fichier, appuyez sur le bouton <strong>IMPORTER</strong> et voilà ! 😁
                </Typography>
              </Grid>
              <Grid item>
                <Button size='medium' variant='outlined' onClick={() => inputRef.current.click()} startIcon={<Upload />}>
                  <ImportInputFile ref={inputRef} mutationRequest={addStudents} />
                  <span>Importer</span>
                </Button>
              </Grid>
            </Grid>
          </WizardFormStep>
        </WizardForm>
      </DialogContent>
    </Dialog>
  )
}
