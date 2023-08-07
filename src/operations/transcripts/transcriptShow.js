import { Show, SimpleShowLayout, TextField } from 'react-admin'
import { useEffect, useState } from 'react'
import transcriptsVersionsProvider from '../../providers/transcriptsVersionsProvider'
import { useParams } from 'react-router-dom'
const TranscriptShow = () => {

  const [ versions, setVersions ] = useState([])
  const [ claims, setClaims ] = useState([])

  const { studentId, transcriptId } = useParams()


  useEffect(() => {
    const effect = async () => {
      const versionsData = await transcriptsVersionsProvider.getList(studentId, transcriptId, 1, 10)
      setVersions(versionsData)
    }
    effect()
  }, [])

  //npx prettier --check "src/**/*.{js,ts,tsx}" "./**/*.{json,yml,yaml}"

  return (
    <>
        <Show resource={'transcripts'} title={'Transcript'}>
            <SimpleShowLayout>
              <TextField source={'semester'} label={'Semestre'} />
              <TextField source={'academic_year'} label={'Année académique'} />
              <TextField source={'creation_datetime'} label={'Date de création'} />
            </SimpleShowLayout>
           <div>
             { versions.length > 0 && <div>
               {versions.map((record) => (<>
                   <span>{record.id}</span>
                   <span>{record.transcript_id}</span>
                   <span>{record.created_by_user_id}</span>t
                 </>
               ))}
             </div> }
           </div>
        </Show>
    </>
  )
}

export default TranscriptShow;