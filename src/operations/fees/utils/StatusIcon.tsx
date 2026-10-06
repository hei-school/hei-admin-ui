import {Fee} from "@haapi-b0fc7615/typescript-client";
import {Help as Question} from "@mui/icons-material";
import {IconButton, Tooltip} from "@mui/material";
import {useRecordContext} from "react-admin";
import {PSP_ICON} from "../components/pspIcon";
import {MPBS_STATUS_LABEL} from "../constants";

export const MpbsStatusIcon = () => {
  const record = useRecordContext<Fee>();
  const mpbsStatus = record?.mpbs?.at(-1)?.status;

  return (
    <Tooltip
      title={mpbsStatus && MPBS_STATUS_LABEL[mpbsStatus]}
      data-testid={`pspTypeIcon-${record?.id}`}
    >
      <IconButton color="info">
        {mpbsStatus ? PSP_ICON[mpbsStatus] : <Question color="disabled" />}
      </IconButton>
    </Tooltip>
  );
};
