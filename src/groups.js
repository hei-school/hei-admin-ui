import * as React from "react";
import { List, Datagrid, TextField } from 'react-admin';

export const GroupList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="ref" />
            <TextField source="name" />
            <TextField source="creation_date" />
        </Datagrid>
    </List>
)

export default GroupList;