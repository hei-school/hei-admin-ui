import { Datagrid, List, Show, SimpleShowLayout, TextField, useShowContext } from "react-admin"
import { toApi3Ids } from "../../providers/transcriptsVersionsProvider"
import { useParams } from 'react-router-dom'

const ClaimsList = () => {

    const { record } = useShowContext()
    const { studentId, transcriptId, versionId } = toApi3Ids(record.id)

    return (
        <List title={'Réclamations'} resource={'claims'} filterDefaultValues={{studentId: studentId, transcriptId: transcriptId, versionId: versionId}} >
            <Datagrid>
                <TextField source={'creation_datetime'} label={'Date de création'}/>
                <TextField source={'status'} label={'Statut'} />
                <TextField source={'reason'} label={'Raison'} /> 
            </Datagrid>
        </List>
    )
}

const TranscriptVersionsShow = () => {

    return (
        <Show title={' '} resource={'transcripts-versions'}>
            <SimpleShowLayout>
                <TextField source={'created_by_user_role'} label={'Role'} />
                <TextField source={'creation_datetime'} label={'Date de création'} />
                <TextField source={'ref'} label={'Référence'} />
            </SimpleShowLayout>
            <ClaimsList/>
        </Show>
    )
}

export default TranscriptVersionsShow