import {Cancel, CheckCircle, Pending} from "@mui/icons-material";

export const PSP_ICON = {
  PENDING: <Pending color="info" />,
  SUCCESS: <CheckCircle color="success" />,
  FAILED: <Cancel color="error" />,
} as const;
