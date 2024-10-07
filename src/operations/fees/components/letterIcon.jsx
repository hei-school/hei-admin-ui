import {useRecordContext} from "react-admin";
import {IconButton, Tooltip} from "@mui/material";
import {
  Help as Question,
  Cancel,
  CheckCircle,
  Pending,
} from "@mui/icons-material";

export const LETTER_STATUS_LABEL = {
  RECEIVED: "Paiement avec succès",
  REJECTED: "Paiement échoué",
  PENDING: "Vérification en cours",
};

export const LETTER_ICON = {
  PENDING: <Pending color="info" />,
  RECEIVED: <CheckCircle color="success" />,
  REJECTED: <Cancel color="error" />,
};

export const LetterStatusIcon = () => {
  const record = useRecordContext();

  return (
    <Tooltip
      title={LETTER_STATUS_LABEL[record.letter?.status]}
      data-testid={`letterTypeIcon-${record.id}`}
    >
      <IconButton variant="contained" color="info">
        {record.letter?.status ? (
          LETTER_ICON[record.letter?.status]
        ) : (
          <Question color="disabled" />
        )}
      </IconButton>
    </Tooltip>
  );
};
