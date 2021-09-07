import { Card, CardContent, Typography,withStyles } from "@material-ui/core";
import * as React from "react";
import { List, Datagrid, TextField, ImageField, ReferenceField, Show, ShowButton, useRecordContext, TabbedShowLayout, Tab, ArrayField, DateField } from 'react-admin';
import Timetable from "./timetable";

export const StudentList = props => (
    <List {...props}>
        <Datagrid rowClick="show">
            <TextField source="ref" />
            <TextField source="first_name" />
            <TextField source="last_name" />
            <ReferenceField reference="groups" source="group.id">
                <TextField source="ref" />
            </ReferenceField>
            <ShowButton />
        </Datagrid>
    </List>
)

const Aside = () => {
    const record = useRecordContext();
    return (
        <Card>
            <ImageField source="ref" title="ref" />
            <CardContent>
                <Typography variant="h6">Student details</Typography>
                {record && (
                    <Typography variant="body2">
                        Ref: {record.ref}
                    </Typography>
                )}
                {record && (
                    <Typography variant="body2">
                        Group: {record.group.ref}
                    </Typography>
                )}
                {record && (
                    <Typography variant="body2">
                        First name: {record.first_name}
                    </Typography>
                )}
                {record && (
                    <Typography variant="body2">
                        Last name: {record.last_name}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

const FullArrayField = withStyles({
    root: {
        width: 100
    }
})(ArrayField);

export const StudentShow = props => (
    <Show aside={<Aside />} {...props}>
        <TabbedShowLayout>
            <Tab label="Courses">
                <FullArrayField source="enrolled_courses" label="">
                    <Datagrid expand={<FullArrayField source="timetable">
                        <Datagrid>
                            <ReferenceField reference="teachers" source="teacher_id">
                                <TextField source="first_name" />
                            </ReferenceField>
                            <DateField showTime={true} source="start" />
                            <DateField showTime={true} source="end" />
                        </Datagrid>
                    </FullArrayField>}>
                        <TextField source="course_code" />
                        <TextField source="course_name" />
                    </Datagrid>
                </FullArrayField>
            </Tab>
            <Tab label="Timetable">
                <Timetable />
            </Tab>
        </TabbedShowLayout>
    </Show>
);

export default StudentList;