import {DateField} from "@/operations/common/components/fields";
import {HaList} from "@/ui/haList";
import {ComplaintStatusHistory} from "@haapi-3d601c85/typescript-client";
import {History} from "@mui/icons-material";
import {FunctionField, TextField} from "react-admin";
import {ComplaintStatusChip} from "./ComplaintStatusChip";

export const ComplaintStatusHistoryList = ({
  complaintId,
}: Readonly<{complaintId: string}>) => (
  <HaList
    title="Historique des statuts"
    resource="complaint-status-history"
    icon={<History />}
    emptyListMessage="Aucun historique pour cette réclamation"
    datagridProps={{rowClick: false}}
    listProps={{
      filter: {complaintId},
    }}
  >
    <FunctionField<ComplaintStatusHistory>
      label="Statut"
      render={(history) => <ComplaintStatusChip status={history?.status} />}
    />
    <TextField source="comment" label="Message" emptyText="—" />
    <TextField source="changed_by.first_name" label="Prénom" />
    <TextField source="changed_by.last_name" label="Nom" />
    <DateField source="datetime" label="Date" showTime />
  </HaList>
);
