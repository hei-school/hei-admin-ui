import { useEffect, useState, useCallback, useRef } from 'react'
import { Show, SimpleShowLayout, TextField, useShowContext, useNotify } from 'react-admin'
import { toApiIds } from '../../providers/transcriptsProvider'
import { transcriptApi } from '../../providers/api'
import { Stack, Box, InputLabel, MenuItem, FormControl, Select, Grid, TextField as MuiTextField, Button, Typography, Chip } from "@mui/material"
import { Color } from "../../utils/color";
import { v4 as uuid } from "uuid";
import PdfViewer from '../../utils/pdf-viewer';

const TranscriptVersions = ({ onVersionUpdate }) => {
  const [versions, setVersions] = useState([])
  const [versionId, setVersionId] = useState(null);
  const { record } = useShowContext()
  const { studentId, transcriptId } = toApiIds(record.id)

  useEffect(() => {
    const doFetch = async () => {
      const res = await transcriptApi().getTranscriptsVersions(studentId, transcriptId, 1, 10)
      setVersions(res.data);
    }
    doFetch()
  }, [studentId, transcriptId])

  const handleChange = (e) => {
    const idx = e.target.value;
    idx && onVersionUpdate(versions[idx]);
    setVersionId(idx);
  }

  return (
    <>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Versions</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={versionId}
          label="Versions"
          onChange={handleChange}
        >
          {versions && versions.map((record, index) => (
            <MenuItem value={index}>{record.creation_datetime}</MenuItem>
          ))}

        </Select>
      </FormControl>
    </>
  )
}

const renderClaimStatus = (status) => {
  const bgcolor = status === "OPEN" ? "#149334" : "#B71816";
  return <Chip label={status.toLowerCase()} sx={{ m: 2, color: 'white', bgcolor }} size="small" />
}

const TranscriptClaim = ({ claim }) => {
  /*
   * TODO: update claim
   * <MuiTextField variant='outlined' {...register('reason')} />
   * <Select {...register('status')} size='small'>
   *   <MenuItem value='OPEN'>OPEN</MenuItem>
   *   <MenuItem value='CLOSE'>CLOSE</MenuItem>
   * </Select>
   * <Button
   *   onClick={handleSubmit(update)}
   *   sx={{
   *     mt: '0.5rem',
   *     display: 'block',
   *     bgcolor: Color['100'],
   *     color: Color['500'],
   *     '&:hover': {
   *       bgcolor: '#FDEAC4',
   *       boxShadow: 'none'
   *     }
   *   }}
   * >
   *   confirmer
   * </Button>
   * */
  return (
    <Stack alignItems='center' direction='row' justifyContent='space-between' my={1}>
      <Typography>{claim.reason}</Typography>
      {renderClaimStatus(claim.status)}
    </Stack>
  )
}

// nb: notice how i separate this from the main Transcript details
// not only i can access the ShowContext (which contains the record, ... everything)
// but the responsibilities is also well defined
const TranscriptClaimList = () => {
  const [claims, setClaims] = useState([])
  const notify = useNotify()
  const { record } = useShowContext()
  const { studentId, transcriptId } = toApiIds(record.id)
  const claimInputRef = useRef(null)

  const getTranscriptClaims = useCallback(async () => {
    const res = await transcriptApi().getStudentTranscriptClaims(studentId, transcriptId, 'versionId')
    setClaims(res.data)
  }, [setClaims, studentId, transcriptId])

  useEffect(() => {
    getTranscriptClaims();
  }, [transcriptId, studentId, getTranscriptClaims])

  const submitClaim = async ev => {
    ev.preventDefault()
    const { value } = claimInputRef.current
    if (value) {
      try {
        const tsVersionId = 'versionId'
        const id = uuid()
        const studentTsClaim = {
          id,
          transcript_id: transcriptId,
          transcript_version_id: tsVersionId,
          reason: value,
          creation_datetime: new Date().toISOString()
        }
        await transcriptApi().putStudentClaimsOfTranscriptVersion(studentId, transcriptId, tsVersionId, id, studentTsClaim)
        notify('Réclamation soumis avec succès', { type: 'success' })
        claimInputRef.current.value = ''
        getTranscriptClaims();
      } catch (e) {
        console.warn('error', e)
      }
    }
  }

  return (
    <Stack direction='row' justifyContent='space-between' mt={1} p={3} h='auto' spacing={2}>
      <Box sx={{ width: '50%' }}>
        <form onSubmit={submitClaim}>
          <MuiTextField variant='outlined' size='small' placeholder='Raison' inputRef={claimInputRef} />
          <Button
            type='submit'
            sx={{
              mt: '0.5rem',
              display: 'block',
              bgcolor: Color['100'],
              color: Color['500'],
              '&:hover': {
                bgcolor: '#FDEAC4',
                boxShadow: 'none'
              }
            }}
          >
            Soumettre
          </Button>
        </form>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'scroll', maxHeight: '25rem' }}>
        {claims.map(claim => {
          return (
            <TranscriptClaim key={claim.id} claim={claim} />
          )
        })}
      </Box>
    </Stack>
  )
}

// const TranscriptShow = () => {
//   return (
//     <>
//       <Show resource={'transcripts'} title={' '}>
//         <SimpleShowLayout>
//           <TextField source={'semester'} label={'Semestre'} />
//           <TextField source={'academic_year'} label={'Année académique'} />
//           <TextField source={'creation_datetime'} label={'Date de création'} />
//         </SimpleShowLayout>
//         <TranscriptClaimList />
//       </Show>
//     </>
//   )
// }

export const PDF_WIDTH = window.screen.width * 0.4;

const TranscriptView = ({ version }) => {
  const [pdfUrl, setPdfUrl] = useState("")
  const { record } = useShowContext()
  const { studentId, transcriptId } = toApiIds(record.id)

  useEffect(() => {
    const doFetch = async () => {
      const pdfBody = await transcriptApi().getStudentTranscriptVersionPdf(studentId, transcriptId, version.id)
      console.log(pdfBody, " pdfBody.data");
      const blob = new Blob([pdfBody.data])
      setPdfUrl(URL.createObjectURL(blob))
    }
    doFetch()
  }, [studentId, transcriptId, version])

  return (
    <PdfViewer width={PDF_WIDTH} url="https://legal.bpartners.app/cgu_18-04-23.pdf" />
  )
}

const TranscriptShowLayout = () => {
  const [selectedVersion, setSelectedVersion] = useState(null);

  const onVersionUpdate = (version) => {
    setSelectedVersion(version);
  }

  return (
    <>
      <TranscriptVersions onVersionUpdate={onVersionUpdate} />
      <TranscriptView version={selectedVersion} />
      <TranscriptClaimList />
    </>
  )
}

const TranscriptShow = () => {
  return (
    <>
      <Show resource={'transcripts'} title={' '}>
        <SimpleShowLayout>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <TextField source={'semester'} label={'Semestre'} />
            </Grid>
            <Grid item xs={3}>
              <TextField source={'academic_year'} label={'Année académique'} />
            </Grid>
            <Grid item xs={3}>
              <TextField source={'creation_datetime'} label={'Date de création'} />
            </Grid>
          </Grid>
        </SimpleShowLayout>
        <TranscriptShowLayout />
      </Show>
    </>
  )
}

export default TranscriptShow
