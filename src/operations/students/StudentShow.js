import { Show, SimpleShowLayout, TextField } from 'react-admin'

const StudentShow = props => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source='id' />
      <TextField source='title' />
      <TextField source='teaser' />
    </SimpleShowLayout>
  </Show>
)

export default StudentShow
