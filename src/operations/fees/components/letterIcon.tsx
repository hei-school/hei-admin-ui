import {Fee, LetterStatus} from "@haapi-b0fc7615/typescript-client";
import {
  Cancel,
  CheckCircle,
  Pending,
  Help as Question,
} from "@mui/icons-material";
import {IconButton, Tooltip} from "@mui/material";
import {useRecordContext} from "react-admin";

export const LETTER_STATUS_LABEL: Record<LetterStatus, string> = {
  RECEIVED: "Paiement avec succès",
  REJECTED: "Paiement échoué",
  PENDING: "Vérification en cours",
};

export const LETTER_ICON: Record<LetterStatus, JSX.Element> = {
  PENDING: <Pending color="info" />,
  RECEIVED: <CheckCircle color="success" />,
  REJECTED: <Cancel color="error" />,
};

export const LetterStatusIcon = () => {
  const record = useRecordContext<Fee>();
  const letterStatus = record?.letter?.status;

  return (
    <Tooltip
      title={letterStatus && LETTER_STATUS_LABEL[letterStatus]}
      data-testid={`letterTypeIcon-${record?.id}`}
    >
      <IconButton color="info">
        {letterStatus ? (
          LETTER_ICON[letterStatus]
        ) : (
          <Question color="disabled" />
        )}
      </IconButton>
    </Tooltip>
  );
};
