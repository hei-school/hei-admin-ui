import {useToggle} from "@/hooks";
import {payingApi} from "@/providers/api";
import {toApiIds} from "@/providers/feeProvider";
import {ArchiveStatusEnum, Fee} from "@haapi-3d601c85/typescript-client";
import {Block, CheckCircle} from "@mui/icons-material";
import ArchiveIcon from "@mui/icons-material/Archive";
import {Box, Button, Chip} from "@mui/material";
import {
  Confirm,
  useNotify,
  useRecordContext,
  useRedirect,
  useRefresh,
} from "react-admin";

interface FeeArchiveActionsProps {
  studentId: string;
  redirect?: string;
}

const stopPropagation = (event: React.MouseEvent) => event.stopPropagation();

export const FeeArchiveActions = ({
  studentId,
  redirect,
}: FeeArchiveActionsProps) => {
  const fee = useRecordContext<Fee>();
  const notify = useNotify();
  const doRedirect = useRedirect();
  const refresh = useRefresh();
  const [isRequesting, , toggleRequesting] = useToggle();
  const [isValidating, , toggleValidating] = useToggle();
  const [isRejecting, , toggleRejecting] = useToggle();

  if (!fee) return null;

  const archiveStatus = fee.archive_status;

  const requestArchive = async () => {
    toggleRequesting();
    try {
      const {feeId} = toApiIds(fee.id);
      await payingApi().archiveStudentFee(studentId, feeId);
      notify("Demande d'archivage envoyée.");
      refresh();
      if (redirect) doRedirect(redirect);
    } catch (error) {
      console.error(error);
      notify("Une erreur s'est produite lors de la demande d'archivage.", {
        type: "error",
      });
    }
  };

  const reviewArchive =
    (status: ArchiveStatusEnum, toggle: () => void, successMsg: string) =>
    async () => {
      toggle();
      try {
        const {feeId} = toApiIds(fee.id);
        await payingApi().updateFeeArchiveStatus(studentId, feeId, {status});
        notify(successMsg);
        refresh();
        if (redirect) doRedirect(redirect);
      } catch (error) {
        console.error(error);
        notify("Une erreur s'est produite.", {type: "error"});
      }
    };

  if (archiveStatus === ArchiveStatusEnum.ARCHIVED) {
    return (
      <Chip
        data-testid="fee-archive-status"
        icon={<ArchiveIcon />}
        label="Archivé"
        size="small"
        variant="outlined"
      />
    );
  }

  if (archiveStatus === ArchiveStatusEnum.TO_ARCHIVE) {
    return (
      <Box sx={{display: "flex", alignItems: "center", gap: 0.5}}>
        <Button
          data-testid="validate-archive-button-confirm"
          color="success"
          size="small"
          startIcon={<CheckCircle />}
          onClick={(event) => {
            stopPropagation(event);
            toggleValidating();
          }}
        >
          Valider
        </Button>
        <Button
          data-testid="reject-archive-button-confirm"
          color="error"
          size="small"
          startIcon={<Block />}
          onClick={(event) => {
            stopPropagation(event);
            toggleRejecting();
          }}
        >
          Rejeter
        </Button>
        <Confirm
          fullWidth
          sx={{zIndex: 99999}}
          isOpen={isValidating}
          title="Validation d'archivage de frais"
          content="Confirmez-vous l'archivage de ce frais ?"
          onConfirm={reviewArchive(
            ArchiveStatusEnum.ARCHIVED,
            toggleValidating,
            "Frais archivé avec succès."
          )}
          onClose={toggleValidating}
          ConfirmIcon={CheckCircle}
          confirmColor="primary"
          confirm="Valider"
        />
        <Confirm
          fullWidth
          sx={{zIndex: 99999}}
          isOpen={isRejecting}
          title="Rejet de la demande d'archivage"
          content="Confirmez-vous le rejet de cette demande d'archivage ?"
          onConfirm={reviewArchive(
            ArchiveStatusEnum.REJECTED,
            toggleRejecting,
            "Demande d'archivage rejetée."
          )}
          onClose={toggleRejecting}
          ConfirmIcon={Block}
          confirmColor="warning"
          confirm="Rejeter"
        />
      </Box>
    );
  }

  const isRejected = archiveStatus === ArchiveStatusEnum.REJECTED;

  return (
    <div className="archive-button-wrapper">
      <Button
        color="warning"
        size="small"
        data-testid="archive-button-confirm"
        startIcon={<ArchiveIcon />}
        onClick={(event) => {
          stopPropagation(event);
          toggleRequesting();
        }}
      >
        {isRejected ? "Réarchiver" : "Archiver"}
      </Button>
      <Confirm
        fullWidth
        sx={{zIndex: 99999}}
        isOpen={isRequesting}
        title="Archivage de frais"
        content={
          isRejected
            ? "La précédente demande d'archivage a été rejetée. Confirmez-vous une nouvelle demande d'archivage de ce frais ?"
            : "Confirmez-vous la demande d'archivage de ce frais ?"
        }
        onConfirm={requestArchive}
        onClose={toggleRequesting}
        ConfirmIcon={ArchiveIcon}
        confirmColor="warning"
        confirm="Archiver"
      />
    </div>
  );
};
