import {Show} from "@/operations/common/components";
import {EMPTY_TEXT} from "@/ui/constants";
import {Complaint} from "@haapi-3d601c85/typescript-client";
import {Box, Chip, Grid, Stack, Typography} from "@mui/material";
import {ReactNode} from "react";
import {useRecordContext} from "react-admin";
import {useParams} from "react-router-dom";
import {ComplaintStatusActions} from "./components/ComplaintStatusActions";
import {ComplaintStatusChip} from "./components/ComplaintStatusChip";
import {ComplaintStatusHistoryList} from "./components/ComplaintStatusHistoryList";
import {COMPLAINT_TYPE_LABELS} from "./utils/constants";

const DetailField = ({
  label,
  value,
  fullWidth = false,
}: Readonly<{label: string; value: ReactNode; fullWidth?: boolean}>) => (
  <Grid item xs={12} sm={fullWidth ? 12 : 6}>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Box sx={{mt: 0.5}}>
      {typeof value === "string" || value == null ? (
        <Typography>{value || EMPTY_TEXT}</Typography>
      ) : (
        value
      )}
    </Box>
  </Grid>
);

const ComplaintShowContent = () => {
  const complaint = useRecordContext<Complaint>();
  if (!complaint) return null;

  const studentName = complaint.student
    ? `${complaint.student.first_name ?? ""} ${complaint.student.last_name ?? ""}`.trim()
    : null;

  return (
    <Box sx={{p: 3}}>
      <Grid container spacing={3} sx={{mb: 3}}>
        <DetailField label="Titre" value={complaint.title} />
        <DetailField
          label="Type"
          value={complaint.type ? COMPLAINT_TYPE_LABELS[complaint.type] : null}
        />
        <DetailField
          label="Statut"
          value={<ComplaintStatusChip status={complaint.status} />}
        />
        <DetailField label="Étudiant" value={studentName} />
        <DetailField
          label="Description"
          value={complaint.description}
          fullWidth
        />
        <DetailField
          label="Assigné à"
          value={
            complaint.assignees && complaint.assignees.length > 0 ? (
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {complaint.assignees.map((assignee) => (
                  <Chip
                    key={assignee.id}
                    size="small"
                    label={`${assignee.first_name ?? ""} ${assignee.last_name ?? ""}`.trim()}
                  />
                ))}
              </Stack>
            ) : null
          }
          fullWidth
        />
      </Grid>
      <ComplaintStatusActions />
    </Box>
  );
};

export const ComplaintShow = () => {
  const {id} = useParams();

  return (
    <Box>
      <Show id={id} resource="complaints" title="Détails de la réclamation">
        <ComplaintShowContent />
      </Show>
      {id && <ComplaintStatusHistoryList complaintId={id} />}
    </Box>
  );
};
