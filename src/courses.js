import * as React from "react";
import { List, Datagrid, TextField } from 'react-admin';

export const CourseList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="ref" />
            <TextField source="code" />
            <TextField source="name" />
            <TextField source="total_hours" />
        </Datagrid>
    </List>
)

export default CourseList;