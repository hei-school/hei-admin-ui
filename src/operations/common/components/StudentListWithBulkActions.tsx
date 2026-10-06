import {HaList} from "@/ui/haList";
import {Typography} from "@mui/material";
import {Dispatch, SetStateAction, useEffect} from "react";
import {Datagrid, TextField, useListContext} from "react-admin";

interface ListContentProps {
  setStudentsIds: Dispatch<SetStateAction<string[]>>;
}

interface StudentListWithBulkActionsProps extends ListContentProps {
  title?: string;
}

const ListContent = ({setStudentsIds}: Readonly<ListContentProps>) => {
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
          display: "none",
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
}: Readonly<StudentListWithBulkActionsProps>) => (
  <HaList
    resource="students"
    listProps={{
      title: " ",
    }}
    title={
      <Typography variant="body2" fontWeight="bolder" component="span">
        {title}
      </Typography>
    }
    mainSearch={{label: "Prénom·s", source: "first_name"}}
    hasDatagrid={false}
    actions={undefined}
    icon={undefined}
  >
    <ListContent setStudentsIds={setStudentsIds} />
  </HaList>
);
