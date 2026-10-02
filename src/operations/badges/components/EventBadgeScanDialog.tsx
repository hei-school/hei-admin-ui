import {Close} from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import {checkAttendanceByPublicId} from "../badgeApi";
import {explainAttendanceError, fullName, useScanResults} from "../scanResults";
import {BadgeScanner} from "./BadgeScanner";
import {ScanResultList} from "./ScanResults";

export type EventBadgeScanDialogProps = {
  open: boolean;
  onClose: () => void;
  eventId: string;
  onChecked: () => void;
};

export const EventBadgeScanDialog = ({
  open,
  onClose,
  eventId,
  onChecked,
}: EventBadgeScanDialogProps) => {
  const {results, pushResult} = useScanResults();

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
      pushResult({
        success: false,
        ...(await explainAttendanceError(
          publicId,
          error,
          "Ne participe pas à cet événement."
        )),
      });
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
          <ScanResultList results={results} />
        )}
      </DialogContent>
    </Dialog>
  );
};
