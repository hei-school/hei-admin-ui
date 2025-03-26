import {HaList} from "@/ui/haList";
import {Typography} from "@mui/material";
import {Dispatch, FC, SetStateAction, useEffect} from "react";
import {Datagrid, TextField, useListContext} from "react-admin";

interface bulkActionButtonsProps {
  setStudentsIds: Dispatch<SetStateAction<string[]>>;
  onBulkAction?: () => void;
  title?: string;
}

const ListContent: FC<bulkActionButtonsProps> = ({setStudentsIds}) => {
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

export const StudentListWithBulkActions: FC<bulkActionButtonsProps> = ({
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
    actions={undefined}
    icon={undefined}
  >
    <ListContent setStudentsIds={setStudentsIds} />
  </HaList>
);
