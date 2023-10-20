import { Show, SimpleShowLayout } from 'react-admin'
import DocLayout from '../docs/DocShow'

const HeiDocsShow = () => {
  return (
    <Show title={"Visualisation d'un document"}>
      <SimpleShowLayout>
        <DocLayout resource='hei-docs' />
      </SimpleShowLayout>
    </Show>
  )
}
export default HeiDocsShow
