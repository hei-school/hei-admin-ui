import {DateField} from "@/operations/common/components/fields";
import {HaList} from "@/ui/haList";
import {Complaint} from "@haapi-3d601c85/typescript-client";
import {ReportProblem} from "@mui/icons-material";
import {Box} from "@mui/material";
import {FunctionField, ShowButton, TextField} from "react-admin";
import {ComplaintFilter} from "./components/ComplaintFilter";
import {ComplaintStatusChip} from "./components/ComplaintStatusChip";
import {COMPLAINT_TYPE_LABELS} from "./utils/constants";

export const ComplaintList = () => (
  <HaList
    resource="complaints"
    title="Réclamations"
    icon={<ReportProblem />}
    emptyListMessage="La liste des réclamations est vide"
    datagridProps={{rowClick: "show"}}
    header={
      <Box sx={{px: 2.5, pt: 2}}>
        <ComplaintFilter />
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
    <TextField source="student.first_name" label="Prénom" />
    <TextField source="student.last_name" label="Nom" />
    <FunctionField<Complaint>
      label="Statut"
      render={(complaint) => <ComplaintStatusChip status={complaint?.status} />}
    />
    <DateField source="created_at" label="Créée le" showTime />
    <ShowButton data-testid="show-button" />
  </HaList>
);
