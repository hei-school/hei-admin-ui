import { Toolbar, SaveButton } from 'react-admin'

export const EditToolBar = props => (
  <Toolbar {...props}>
    <SaveButton disabled={props.pristine} />
  </Toolbar>
)
