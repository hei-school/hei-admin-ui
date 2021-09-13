import * as React from 'react'
import { List, Datagrid, TextField } from 'react-admin'

export const GroupList = props => (
  <List {...props}>
    <Datagrid>
      <TextField source='ref' />
      <TextField source='name' label='Nom' />
      <TextField source='creation_date' label='Date de création' />
    </Datagrid>
  </List>
)

export default GroupList
