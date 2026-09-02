import {CONFIRM_DIALOG_Z_INDEX} from "@/ui/constants/common_styles";
import ArchiveIcon from "@mui/icons-material/Archive";
import {Button, ButtonProps, Tooltip} from "@mui/material";
import {
  Confirm,
  RaRecord,
  useNotify,
  useRecordContext,
  useRedirect,
} from "react-admin";
import {useToggle} from "../../../hooks";

interface ArchiveWithConfirmProps {
  text?: string;
  confirmTitle: string;
  confirmContent: string;
  redirect?: string;
  buttonProps?: ButtonProps;
  getDisabledReason?: (record: RaRecord) => string | undefined;
  onArchive: (record: RaRecord) => Promise<any>;
}

export const ArchiveWithConfirm = ({
  text,
  confirmTitle,
  confirmContent,
  redirect,
  buttonProps = {},
  getDisabledReason,
  onArchive,
}: ArchiveWithConfirmProps) => {
  const record = useRecordContext();
  const [showConfirm, , toggleShowConfirm] = useToggle();
  const notify = useNotify();
  const doRedirect = useRedirect();
  const disabledReason = record?.is_archived
    ? "Ce frais est déjà archivé."
    : record && getDisabledReason
      ? getDisabledReason(record)
      : undefined;
  const toggleView = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    toggleShowConfirm();
  };
  const doArchive = async () => {
    toggleShowConfirm();
    if (!record) {
      notify("Impossible de récupérer l'élément à archiver.", {
        type: "error",
      });
      return;
    }
    if (disabledReason) {
      notify(disabledReason, {type: "error"});
      return;
    }
    try {
      await onArchive(record);
      notify("Frais archivé avec succès.");
      if (redirect) {
        doRedirect(redirect);
      }
    } catch (error) {
      console.error(error);
      notify("Une erreur s'est produite lors de l'archivage.", {
        type: "error",
      });
    }
  };
  const archiveButton = (
    <Button
      color="warning"
      size="small"
      data-testid="archive-button-confirm"
      disabled={!!disabledReason}
      startIcon={<ArchiveIcon />}
      onClick={toggleView}
      {...buttonProps}
    >
      {text}
    </Button>
  );
  return (
    <div className="archive-button-wrapper">
      {disabledReason ? (
        <Tooltip title={disabledReason}>
          <span style={{display: "inline-flex", alignItems: "center"}}>
            {archiveButton}
          </span>
        </Tooltip>
      ) : (
        archiveButton
      )}
      <Confirm
        fullWidth
        sx={{zIndex: CONFIRM_DIALOG_Z_INDEX}}
        isOpen={showConfirm}
        title={confirmTitle}
        content={confirmContent}
        onConfirm={doArchive}
        onClose={toggleShowConfirm}
        ConfirmIcon={ArchiveIcon}
        confirmColor="warning"
        confirm="Archiver"
      />
    </div>
  );
};
