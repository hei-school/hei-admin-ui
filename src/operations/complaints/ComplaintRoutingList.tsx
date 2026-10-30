import {useToggle} from "@/hooks";
import {DateField} from "@/operations/common/components/fields";
import {Dialog} from "@/ui/components";
import {HaList} from "@/ui/haList";
import {ComplaintRouting} from "@haapi-3d601c85/typescript-client";
import {Add as AddIcon, AssignmentInd} from "@mui/icons-material";
import {Button} from "@mui/material";
import {FunctionField, TextField, useRefresh} from "react-admin";
import {ComplaintRoutingForm} from "./components/ComplaintRoutingForm";
import {ComplaintRoutingInlineFilter} from "./components/ComplaintRoutingInlineFilter";
import {COMPLAINT_TYPE_LABELS} from "./utils/constants";

export const ComplaintRoutingList = () => {
  const [showCreate, , toggleShowCreate] = useToggle();
  const refresh = useRefresh();

  return (
    <>
      <HaList
        resource="complaint-routings"
        title="Assignements des managers"
        icon={<AssignmentInd />}
        emptyListMessage="Aucun assignement de manager pour le moment"
        datagridProps={{rowClick: false}}
        filterButtons={<ComplaintRoutingInlineFilter />}
        directActions={
          <Button
            data-testid="create-routing"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={toggleShowCreate}
          >
            Nouvel assignement
          </Button>
        }
      >
        <FunctionField<ComplaintRouting>
          label="Type"
          render={(routing) =>
            routing?.type ? COMPLAINT_TYPE_LABELS[routing.type] : null
          }
        />
        <TextField source="manager.first_name" label="Prénom" />
        <TextField source="manager.last_name" label="Nom" />
        <DateField source="creation_datetime" label="Assigné le" showTime />
      </HaList>
      <Dialog
        title="Nouvel assignement de manager"
        open={showCreate}
        onClose={toggleShowCreate}
      >
        <ComplaintRoutingForm
          onSuccess={() => {
            toggleShowCreate();
            refresh();
          }}
        />
      </Dialog>
    </>
  );
};
