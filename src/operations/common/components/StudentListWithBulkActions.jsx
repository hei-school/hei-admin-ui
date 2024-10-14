import {useEffect} from "react";
import {Datagrid, TextField, useListContext} from "react-admin";
import {Typography} from "@mui/material";
import {HaList} from "@/ui/haList";

const ListContent = ({setStudentsIds}) => {
  const {selectedIds} = useListContext();

  useEffect(() => {
    setStudentsIds(selectedIds);
  }, [selectedIds]);

  return (
    <Datagrid
      bulkActionButtons={<></>}
      rowClick={false}
      sx={{
        "& .RaBulkActionsToolbar-toolbar": {
          width: "fit-content",
        },
      }}
    >
      <TextField source="ref" label="Référence" />
      <TextField source="first_name" label="Prénom·s" />
      <TextField source="last_name" label="Nom·s" />
    </Datagrid>
  );
};

export const StudentListWithBulkActions = ({
  setStudentsIds,
  title = "Ajouter des étudiants",
}) => (
  <HaList
    resource="students"
    listProps={{
      title: " ",
    }}
    title={
      <Typography variant="body2" fontWeight="bolder">
        {title}
      </Typography>
    }
    mainSearch={{label: "Prénom·s", source: "first_name"}}
    hasDatagrid={false}
  >
    <ListContent setStudentsIds={setStudentsIds} />
  </HaList>
);
