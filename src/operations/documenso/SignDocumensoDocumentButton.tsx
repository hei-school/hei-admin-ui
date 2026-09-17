import {useNotify} from "@/hooks";
import {DocumensoDocumentStatus} from "@haapi-b0fc7615/typescript-client";
import {Draw as SignIcon} from "@mui/icons-material";
import {useState} from "react";
import {Button, useDataProvider, useRecordContext} from "react-admin";

const BUTTON_SX = {textTransform: "none"};

const DOCUMENSO_HOST = process.env.REACT_APP_DOCUMENSO_URL;

export const SignDocumensoDocumentButton = () => {
  const record = useRecordContext();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const [isOpening, setIsOpening] = useState(false);

  if (!record) {
    return null;
  }
  const isPending = record.status === DocumensoDocumentStatus.PENDING;

  const openSigning = async () => {
    if (!DOCUMENSO_HOST) {
      notify(
        "L'URL de Documenso n'est pas configurée (REACT_APP_DOCUMENSO_URL)",
        {type: "error"}
      );
      return;
    }
    const tab = window.open("", "_blank");
    setIsOpening(true);
    try {
      const {
        data: {token},
      } = await dataProvider.getOne("documenso-signing-tokens", {
        id: record.id,
      });
      if (!tab) {
        notify(
          "Autorisez les fenêtres surgissantes pour signer la fiche sur Documenso",
          {type: "warning"}
        );
        return;
      }
      tab.opener = null;
      tab.location.href = `${DOCUMENSO_HOST}/sign/${token}`;
    } catch {
      tab?.close();
      notify("Impossible d'ouvrir la fiche à signer", {type: "error"});
    } finally {
      setIsOpening(false);
    }
  };

  return (
    <Button
      onClick={openSigning}
      startIcon={<SignIcon />}
      label="Signer"
      data-testid="sign-documenso-document-button"
      variant="contained"
      disabled={isOpening || !isPending}
      sx={BUTTON_SX}
    />
  );
};
