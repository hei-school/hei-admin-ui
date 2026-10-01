import {CheckCircle, Close, ErrorOutline} from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import {useState} from "react";
import {
  checkAttendanceByPublicId,
  getPublicStudent,
  httpStatusOf,
} from "../badgeApi";
import {BadgeScanner} from "./BadgeScanner";

type ScanResult = {
  key: number;
  success: boolean;
  label: string;
  detail: string;
};

let resultKey = 0;

const fullName = (student: {first_name?: string; last_name?: string}) =>
  `${student.last_name ?? ""} ${student.first_name ?? ""}`.trim();

export type EventBadgeScanDialogProps = {
  open: boolean;
  onClose: () => void;
  eventId: string;
  /** Called after each successful scan, e.g. to refresh the participants list. */
  onChecked: () => void;
};

export const EventBadgeScanDialog = ({
  open,
  onClose,
  eventId,
  onChecked,
}: EventBadgeScanDialogProps) => {
  const [results, setResults] = useState<ScanResult[]>([]);

  const pushResult = (result: Omit<ScanResult, "key">) =>
    setResults((previous) =>
      [{...result, key: ++resultKey}, ...previous].slice(0, 20)
    );

  const explainError = async (publicId: string, error: unknown) => {
    const status = httpStatusOf(error);
    if (status === 400) {
      return {label: "Badge annulé", detail: "Ce badge a été déclaré perdu."};
    }
    if (status === 404) {
      try {
        const student = await getPublicStudent(publicId);
        return {
          label: fullName(student),
          detail: "Ne participe pas à cet événement.",
        };
      } catch {
        return {label: "Badge inconnu", detail: "Ce badge n'existe pas."};
      }
    }
    if (status === 403) {
      return {label: "Accès refusé", detail: "Vous ne pouvez pas pointer."};
    }
    return {label: "Erreur", detail: "Réessayez de scanner le badge."};
  };

  const onScan = async (publicId: string) => {
    try {
      const participant = await checkAttendanceByPublicId(eventId, publicId);
      pushResult({
        success: true,
        label: fullName(participant),
        detail: `${participant.ref ?? ""} · présent(e)`,
      });
      onChecked();
    } catch (error) {
      pushResult({success: false, ...(await explainError(publicId, error))});
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{pr: 6}}>
        Scanner les badges
        <IconButton
          aria-label="Fermer"
          onClick={onClose}
          sx={{position: "absolute", right: 8, top: 8}}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {open && <BadgeScanner onScan={onScan} />}
        {results.length === 0 ? (
          <Typography variant="body2" color="text.secondary" mt={1}>
            Présentez les badges un par un devant la caméra : chaque étudiant
            scanné est marqué présent.
          </Typography>
        ) : (
          <List dense>
            {results.map((result) => (
              <ListItem key={result.key} disableGutters>
                <ListItemIcon sx={{minWidth: 36}}>
                  {result.success ? (
                    <CheckCircle color="success" />
                  ) : (
                    <ErrorOutline color="error" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={result.label}
                  secondary={result.detail}
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};
