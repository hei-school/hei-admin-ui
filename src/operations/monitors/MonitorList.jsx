import React from "react";
import {List, Datagrid, TextField, EmailField, ShowButton} from "react-admin";
import {useLocation} from "react-router-dom";

const MonitorList = (props) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const monitorId = searchParams.get("monitorId");

  return (
    <List {...props} filter={{monitorId}}>
      <Datagrid>
        <TextField source="id" />
        <TextField source="name" />
        <EmailField source="email" />
        <ShowButton />
      </Datagrid>
    </List>
  );
};

export default MonitorList;
