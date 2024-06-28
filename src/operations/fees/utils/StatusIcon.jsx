import {useRecordContext} from "react-admin";
import {IconButton, Tooltip} from "@mui/material";
import {Help as Question} from "@mui/icons-material";
import {PSP_ICON} from "../components/pspIcon";
import {MPBS_STATUS_LABEL} from "../FeeList";

export const StatusIcon = () => {
  const record = useRecordContext();

  return (
    <Tooltip
      title={MPBS_STATUS_LABEL[record.mpbs?.status]}
      data-testid={`pspTypeIcon-${record.id}`}
    >
      <IconButton variant="contained" color="info">
        {record.mpbs?.status ? (
          PSP_ICON[record.mpbs?.status]
        ) : (
          <Question color="disabled" />
        )}
      </IconButton>
    </Tooltip>
  );
};
