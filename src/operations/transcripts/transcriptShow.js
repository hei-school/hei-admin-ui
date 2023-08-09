import { List, Show, SimpleShowLayout, TextField, useShowContext, Datagrid, EditButton, ShowButton } from 'react-admin'
import { useEffect, useState } from 'react'
import { toApiIds } from '../../providers/transcriptsProvider'

// nb: notice how i separate this from the main Transcript details
// not only i can access the ShowContext (which contains the record, ... everything)
// but the responsibilities is also well defined
const TranscriptVersions = () => {
  const [versions, setVersions] = useState([])
  const { record } = useShowContext()
  const { studentId, transcriptId } = toApiIds(record.id)
  const [ dataToDisplay, setDataToDisplay ] = useState([])

 

  {
    /*
     useEffect(() => {
    const doFetch = async ()  => {
      const versionsData = await transcriptsVersionsProvider.getList(studentId, transcriptId, 1, 10)
      setDataToDisplay( versionsData.map(async (version) => (
        {
          ...version,
          claims : await claimsProvider.getList(studentId, transcriptId, version.id)
        }
      )) )  
    }
    doFetch()
  }, [studentId, transcriptId])
    */
  }

  return (
    <List title={'Versions de relevé '} resource={'transcripts-versions'} filterDefaultValues={{studentId, transcriptId}}>
       <Datagrid bulkActionButtons={false} rowClick={id => `/students/${studentId}/transcripts/${transcriptId}/versions/${id}`}>
        <TextField source='creation_datetime' label='Date de création' />
        <TextField source='ref' label='Référence' />
        <TextField source='created_by_user_role' label='Créateur' />
        <EditButton />
        <ShowButton />
      </Datagrid>   
    </List>
  )
}


const TranscriptShow = () => {
  return (
    <>
    <Show resource={'transcripts'} title={' '}>
      <SimpleShowLayout>
        <TextField source={'semester'} label={'Semestre'} />
        <TextField source={'academic_year'} label={'Année académique'} />
        <TextField source={'creation_datetime'} label={'Date de création'} />
      </SimpleShowLayout>
      <TranscriptVersions />
 
    </Show>

    </>
    
  )
}


export default TranscriptShow
