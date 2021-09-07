import * as React from "react";
import { List, Datagrid, TextField } from 'react-admin';

export const TeacherList = props => (
    <List {...props}>
        <Datagrid>
            <TextField source="ref" />
            <TextField source="first_name" />
            <TextField source="last_name" />
        </Datagrid>
    </List>
)

export default TeacherList;