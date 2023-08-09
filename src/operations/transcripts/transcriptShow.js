import {  Show, SimpleShowLayout, TextField, useShowContext, Datagrid, EditButton, ShowButton } from 'react-admin'
import { useEffect, useState } from 'react'
import { toApiIds } from '../../providers/transcriptsProvider'
import { transcriptApi } from '../../providers/api'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
 
const TranscriptVersions = ({ versionId, setVersionId}) => {
  const [ versions, setVersions ] = useState([])
 const { record } = useShowContext()
 const { studentId, transcriptId } = toApiIds(record.id)
  
useEffect(() => {
const doFetch = async ()  => {
  const versionsData = await transcriptApi().getTranscriptsVersions(studentId, transcriptId, 1, 10)
  setVersions(versionsData.data)
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

const Claims = ({versionsId}) => {
  const [ claims, setClaims ] = useState([])
  const { record } = useShowContext()
  const { studentId, transcriptId } = toApiIds(record.id)

  useEffect(() => {
    const doFetch = async () => {
      const fetchClaims = await transcriptApi().getStudentTranscriptClaims(studentId, transcriptId, versionsId, 1, 10)
      setClaims(fetchClaims.data)
    }

    doFetch()

  }, [versionsId])

  return (
    <div>
      {claims.length !== 0 && <div>
        {claims.map((record) => (
          <>
            <span>{record.status}</span>
            <span>{record.reason}</span>
          </>
        ))}
      </div> }
    </div>
  )
}

const TranscriptShow = () => {
  
  const { record } = useShowContext()
  const { studentId, transcriptId } = toApiIds(record.id)
  const [ versionId, setVersionId ] = useState("")

  return (
    <>
    <Show resource={'transcripts'} title={' '}>
      <SimpleShowLayout>
        <TextField source={'semester'} label={'Semestre'} />
        <TextField source={'academic_year'} label={'Année académique'} />
        <TextField source={'creation_datetime'} label={'Date de création'} />
      </SimpleShowLayout>
      <TranscriptVersions setVersionId={setVersionId} studentId={studentId} transcriptId={transcriptId} versionId={versionId} />
      <Claims studentId={studentId} transcriptId={transcriptId} versionsId={versionId} />
    </Show>

    </>
    
  )
}


export default TranscriptShow
