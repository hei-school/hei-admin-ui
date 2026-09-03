import {useToggle} from "@/hooks/useToggle";
import {FeeRecord} from "@/operations/fees/hooks/useFeesToArchive";
import {payingApi} from "@/providers/api";
import {toApiIds} from "@/providers/feeProvider";
import {CONFIRM_DIALOG_Z_INDEX} from "@/ui/constants/common_styles";
import {ArchiveStatusEnum} from "@haapi-b0fc7615/typescript-client";
import ArchiveIcon from "@mui/icons-material/Archive";
import CancelIcon from "@mui/icons-material/Cancel";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import {Box, Button} from "@mui/material";
import {Confirm, useNotify, useRecordContext, useRefresh} from "react-admin";

const runArchiveAction = async (
  action: () => Promise<unknown>,
  successMessage: string,
  onDone: () => void,
  notify: ReturnType<typeof useNotify>
) => {
  try {
    await action();
    notify(successMessage, {type: "success"});
    onDone();
  } catch (error) {
    console.error(error);
    notify("Une erreur s'est produite.", {type: "error"});
  }
};

export const FeeArchiveRowActions = ({
  tab,
  onDone,
}: {
  tab: ArchiveStatusEnum;
  onDone?: () => void;
}) => {
  const record = useRecordContext<FeeRecord>();
  const notify = useNotify();
  const refresh = useRefresh();
  const [showValidate, , toggleValidate] = useToggle();
  const [showReject, , toggleReject] = useToggle();
  const [showReArchive, , toggleReArchive] = useToggle();

  if (!record) {
    return null;
  }

  const {studentId, feeId} = toApiIds(record.id);

  const doDone = () => {
    refresh();
    onDone?.();
  };

  const doUpdate = (status: ArchiveStatusEnum, successMessage: string) =>
    runArchiveAction(
      () => payingApi().updateFeeArchiveStatus(studentId, feeId, {status}),
      successMessage,
      doDone,
      notify
    );

  const doReArchive = () => {
    toggleReArchive();
    runArchiveAction(
      () => payingApi().archiveStudentFee(studentId, feeId),
      "Demande d'archivage renvoyée.",
      doDone,
      notify
    );
  };

  if (tab === ArchiveStatusEnum.TO_ARCHIVE) {
    return (
      <Box display="flex" gap={1} justifyContent="flex-end">
        <Button
          size="small"
          variant="outlined"
          color="warning"
          startIcon={<ArchiveIcon />}
          onClick={toggleValidate}
        >
          Archiver
        </Button>
        <Button
          size="small"
          variant="outlined"
          color="error"
          startIcon={<CancelIcon />}
          onClick={toggleReject}
        >
          Rejeter
        </Button>
        <Confirm
          sx={{zIndex: CONFIRM_DIALOG_Z_INDEX}}
          isOpen={showValidate}
          title="Archivage de frais"
          content="Confirmez-vous l'archivage de ce frais ? Il ne pourra plus être payé ni modifié."
          onConfirm={() => {
            toggleValidate();
            doUpdate(ArchiveStatusEnum.ARCHIVED, "Frais archivé avec succès.");
          }}
          onClose={toggleValidate}
          confirmColor="warning"
          confirm="Archiver"
        />
        <Confirm
          sx={{zIndex: CONFIRM_DIALOG_Z_INDEX}}
          isOpen={showReject}
          title="Rejet de l'archivage"
          content="Confirmez-vous le rejet de cette demande d'archivage ?"
          onConfirm={() => {
            toggleReject();
            doUpdate(
              ArchiveStatusEnum.REJECTED,
              "Demande d'archivage rejetée."
            );
          }}
          onClose={toggleReject}
          confirmColor="warning"
          confirm="Rejeter"
        />
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="flex-end">
      <Button
        size="small"
        variant="outlined"
        color="warning"
        startIcon={<UnarchiveIcon />}
        onClick={toggleReArchive}
      >
        Réarchiver
      </Button>
      <Confirm
        sx={{zIndex: CONFIRM_DIALOG_Z_INDEX}}
        isOpen={showReArchive}
        title="Réarchivage de frais"
        content="Confirmez-vous l'envoi d'une nouvelle demande d'archivage pour ce frais ?"
        onConfirm={doReArchive}
        onClose={toggleReArchive}
        confirmColor="warning"
        confirm="Réarchiver"
      />
    </Box>
  );
};
