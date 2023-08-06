import { Show, TextField } from 'react-admin'

const TranscriptShow = () => {
  return (
    <Show resource={'transcripts'} title={'Transcript'} >
       <TextField source={'semester'} label={'Semestre'} />
       <TextField source={'academic_year'} label={'Année académique'} />
       <TextField source={'creation_datetime'} label={'Date de création'} />
    </Show>
  )
}

export default TranscriptShow;