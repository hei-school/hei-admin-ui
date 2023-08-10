import { Show, SimpleShowLayout, TextField, useShowContext, Datagrid, EditButton, ShowButton } from 'react-admin'
import { useEffect, useState } from 'react'
import { toApiIds } from '../../providers/transcriptsProvider'
import { transcriptApi } from '../../providers/api'
import { Stack, Box, InputLabel, MenuItem, FormControl, Select, Grid } from "@mui/material"
import PdfViewer from '../../utils/pdf-viewer';

const TranscriptVersions = ({ versionId, setVersionId }) => {
  const [versions, setVersions] = useState([])
  const { record } = useShowContext()
  const { studentId, transcriptId } = toApiIds(record.id)

  useEffect(() => {
    const doFetch = async () => {
      const versionsData = await transcriptApi().getTranscriptsVersions(studentId, transcriptId, 1, 10)
    }
    doFetch()
  }, [studentId, transcriptId])

  const handleChange = (e) => setVersionId(e.target.value)

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
          {versions && versions.map((record) => (
            <MenuItem value={record.id}>{record.creation_datetime}</MenuItem>
          ))}

        </Select>
      </FormControl>
    </>
  )
}

const Claims = ({ versionsId }) => {
  const [claims, setClaims] = useState([])
  const { record } = useShowContext()
  const { studentId, transcriptId } = toApiIds(record.id)

  useEffect(() => {
    const doFetch = async () => {
      const res = await transcriptApi().getStudentTranscriptClaims(studentId, transcriptId, versionsId, 1, 10)
      setClaims(res.data)
    }
    doFetch()
  }, [versionsId, studentId, transcriptId])

  return (
    <div>
      {claims.length !== 0 && <div>
        {claims.map((record) => (
          <>
            <span>{record.status}</span>
            <span>{record.reason}</span>
          </>
        ))}
      </div>}
    </div>
  )
}

const TranscriptShow = () => {

  const [versionId, setVersionId] = useState("")

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
            <Grid item xs={3}>
              <TranscriptVersions setVersionId={setVersionId} versionId={versionId} />
            </Grid>
          </Grid>
        </SimpleShowLayout>

        <Stack justifyContent="center" width='100%'>
          <TranscriptView versionId={versionId} />
        </Stack>

        <Claims versionsId={versionId} />
      </Show>

    </>

  )
}

export const PDF_WIDTH = window.screen.width * 0.4;

const TranscriptView = ({ versionId }) => {
  const [pdfUrl, setPdfUrl] = useState("")
  const { record } = useShowContext()
  const { studentId, transcriptId } = toApiIds(record.id)

  useEffect(() => {
    const doFetch = async () => {
      const pdfBody = await transcriptApi().getStudentTranscriptVersionPdf(studentId, transcriptId, "versionId")
      console.log(pdfBody, " pdfBody.data");
      const blob = new Blob([pdfBody.data])
      setPdfUrl(URL.createObjectURL(blob))
    }
    doFetch()
  }, [studentId, transcriptId])

  return (
    <PdfViewer width={'100%'} url="https://legal.bpartners.app/cgu_18-04-23.pdf" />
  )
}

export default TranscriptShow
