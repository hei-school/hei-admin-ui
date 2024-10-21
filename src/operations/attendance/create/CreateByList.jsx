import React from "react";
import {List} from "@react-admin/ra-rbac";
import {Datagrid, FunctionField, TextField} from "react-admin";
import {LinkButton} from "../list";
import {QrCodeScanner, List as ListIcon} from "@mui/icons-material";
import {PrevNextPagination, pageSize} from "../../utils";
import {ToolBar, Actions} from ".";

export const CreateByList = () => {
  return (
    <>
      <LinkButton to="/attendance" icon={<ListIcon />} bottom="90px" />
      <LinkButton
        to="/attendance/scan"
        icon={<QrCodeScanner />}
        bottom="30px"
      />
      <List
        title="Présences"
        label="Présences"
        actions={<ToolBar />}
        perPage={pageSize}
        pagination={<PrevNextPagination />}
        resource="students"
      >
        <Datagrid bulkActionButtons={false}>
          <TextField source="ref" label="Référence" />
          <TextField source="first_name" label="Prénom·s" />
          <TextField source="last_name" label="Nom·s" />
          <FunctionField
            render={(record) => (
              <Actions
                sx={{gap: 2, justifyContent: "end"}}
                studentId={record.id}
              />
            )}
          />
        </Datagrid>
      </List>
    </>
  );
};
