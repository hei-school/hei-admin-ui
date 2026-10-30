import {useNotify, useToggle} from "@/hooks";
import {DateField} from "@/operations/common/components/fields";
import {Dialog} from "@/ui/components";
import {HaList} from "@/ui/haList";
import {Complaint} from "@haapi-3d601c85/typescript-client";
import {Add as AddIcon, ReportProblem} from "@mui/icons-material";
import {Box, Button} from "@mui/material";
import {FunctionField, ShowButton, TextField} from "react-admin";
import {ComplaintCreate} from "./ComplaintCreate";
import {ComplaintStatusChip} from "./components/ComplaintStatusChip";
import {StudentComplaintFilter} from "./components/StudentComplaintFilter";
import {COMPLAINT_TYPE_LABELS} from "./utils/constants";

export const StudentComplaintList = () => {
  const [showCreate, , toggleShowCreate] = useToggle();
  const notify = useNotify();

  return (
    <>
      <HaList
        resource="student-complaints"
        title="Mes réclamations"
        icon={<ReportProblem />}
        emptyListMessage="Vous n'avez déposé aucune réclamation"
        datagridProps={{rowClick: "show"}}
        directActions={
          <Box sx={{display: "flex", alignItems: "center", gap: 1.5}}>
            <StudentComplaintFilter />
            <Button
              data-testid="create-complaint"
              variant="contained"
              startIcon={<AddIcon />}
              onClick={toggleShowCreate}
            >
              Déposer une réclamation
            </Button>
          </Box>
        }
      >
        <TextField source="title" label="Titre" />
        <FunctionField<Complaint>
          label="Type"
          render={(complaint) =>
            complaint?.type ? COMPLAINT_TYPE_LABELS[complaint.type] : null
          }
        />
        <FunctionField<Complaint>
          label="Statut"
          render={(complaint) => (
            <ComplaintStatusChip status={complaint?.status} />
          )}
        />
        <DateField source="created_at" label="Déposée le" showTime />
        <ShowButton data-testid="show-button" />
      </HaList>
      <Dialog
        title="Déposer une réclamation"
        open={showCreate}
        onClose={toggleShowCreate}
      >
        <ComplaintCreate
          redirect={false}
          mutationOptions={{
            onSuccess: () => {
              notify("Réclamation déposée avec succès");
              toggleShowCreate();
            },
          }}
        />
      </Dialog>
    </>
  );
};
