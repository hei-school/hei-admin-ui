import ArchiveIcon from "@mui/icons-material/Archive";
import {Button, ButtonProps} from "@mui/material";
import {FC} from "react";
import {
  Confirm,
  RaRecord,
  useNotify,
  useRecordContext,
  useRedirect,
} from "react-admin";
import {useToggle} from "../../../hooks";

export const ArchiveWithConfirm: FC<{
  text?: string;
  confirmTitle: string;
  confirmContent: string;
  redirect?: string;
  buttonProps?: ButtonProps;
  onArchive: (record: RaRecord) => Promise<any>;
}> = ({
  text,
  confirmTitle,
  confirmContent,
  redirect,
  buttonProps = {},
  onArchive,
}) => {
  const record = useRecordContext();
  const [showConfirm, , toggleShowConfirm] = useToggle();
  const notify = useNotify();
  const doRedirect = useRedirect();

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

  return (
    <div className="archive-button-wrapper">
      <Button
        color="warning"
        size="small"
        data-testid="archive-button-confirm"
        disabled={record?.is_archived === true}
        startIcon={<ArchiveIcon />}
        onClick={toggleView}
        {...buttonProps}
      >
        {text}
      </Button>

      <Confirm
        fullWidth
        sx={{zIndex: 99999}}
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
