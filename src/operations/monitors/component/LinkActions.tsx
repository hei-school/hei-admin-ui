import {MonitorStudentLinkStatus} from "@haapi-3d601c85/typescript-client";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {IconButton, Stack, Tooltip} from "@mui/material";
import {useCreate, useNotify} from "react-admin";

export const LinkActions = ({
  linkId,
  monitorId,
  studentId,
}: {
  linkId: string;
  monitorId: string;
  studentId: string;
}) => {
  const notify = useNotify();
  const [create, {isLoading}] = useCreate();

  const handleAction = (status: MonitorStudentLinkStatus) => {
    create(
      "unlinked-students",
      {
        data: {
          monitor_student_link: [
            {
              id: linkId,
              monitor_id: monitorId,
              student_id: studentId,
              status,
            },
          ],
        },
      },
      {
        onSuccess: () =>
          notify(`Demande ${status === "LINKED" ? "acceptée" : "refusée"}`, {
            type: "info",
          }),
        onError: () => notify("Erreur lors de la mise à jour", {type: "error"}),
      }
    );
  };

  return (
    <Stack direction="row">
      <Tooltip title="Accepter">
        <IconButton
          onClick={() => handleAction("LINKED")}
          disabled={isLoading}
          sx={{color: "#22c55e"}}
        >
          <CheckCircleIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Refuser">
        <IconButton
          onClick={() => handleAction("DENIED")}
          disabled={isLoading}
          sx={{color: "#ef4444"}}
        >
          <CancelIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};
