import {useNotify} from "@/hooks";
import {DocumensoDocumentStatus} from "@haapi-b0fc7615/typescript-client";
import {PictureAsPdf as PdfIcon} from "@mui/icons-material";
import {useState} from "react";
import {Button, useDataProvider, useRecordContext} from "react-admin";

const BUTTON_SX = {textTransform: "none"};

export const OpenSignedDocumentButton = () => {
  const record = useRecordContext();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const [isOpening, setIsOpening] = useState(false);

  if (!record) {
    return null;
  }
  const isSigned = record.status === DocumensoDocumentStatus.COMPLETED;

  const openSignedFile = async () => {
    const tab = window.open("", "_blank");
    setIsOpening(true);
    try {
      const {
        data: {fileUrl},
      } = await dataProvider.getOne("documenso-file-urls", {id: record.id});
      if (!tab) {
        notify(
          "Autorisez les fenêtres surgissantes pour ouvrir la fiche signée",
          {
            type: "warning",
          }
        );
        return;
      }
      tab.opener = null;
      tab.location.href = fileUrl;
    } catch {
      tab?.close();
      notify("Impossible d'ouvrir la fiche signée", {type: "error"});
    } finally {
      setIsOpening(false);
    }
  };

  return (
    <Button
      onClick={openSignedFile}
      startIcon={<PdfIcon />}
      label="Ouvrir"
      data-testid="open-signed-document-button"
      disabled={isOpening || !isSigned}
      sx={BUTTON_SX}
    />
  );
};
