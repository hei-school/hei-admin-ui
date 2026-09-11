import {useNotify} from "@/hooks";
import {DocumensoDocumentStatus} from "@haapi-b0fc7615/typescript-client";
import {Draw as SignIcon} from "@mui/icons-material";
import {useState} from "react";
import {Button, useDataProvider, useRecordContext} from "react-admin";

const BUTTON_SX = {textTransform: "none"};

const DOCUMENSO_HOST = process.env.REACT_APP_DOCUMENSO_URL;

/**
 * Signing happens on Documenso itself: embedding it here needs a Teams plan, which the account does
 * not have. The token is minted on click and opens the very page Documenso mailed to the monitor.
 */
export const SignDocumensoDocumentButton = () => {
  const record = useRecordContext();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const [isOpening, setIsOpening] = useState(false);

  if (record?.status !== DocumensoDocumentStatus.PENDING) {
    return null;
  }

  const openSigning = async () => {
    if (!DOCUMENSO_HOST) {
      notify(
        "L'URL de Documenso n'est pas configurée (REACT_APP_DOCUMENSO_URL)",
        {type: "error"}
      );
      return;
    }
    /*
     * The tab is opened on the click itself: opening it after the await would be swallowed by
     * pop-up blockers, the token being fetched asynchronously.
     */
    const tab = window.open("", "_blank", "noopener,noreferrer");
    setIsOpening(true);
    try {
      const {
        data: {token},
      } = await dataProvider.getOne("documenso-signing-tokens", {
        id: record.id,
      });
      const signingUrl = `${DOCUMENSO_HOST}/sign/${token}`;
      if (tab) {
        tab.location.href = signingUrl;
      } else {
        window.location.href = signingUrl;
      }
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
      disabled={isOpening}
      sx={BUTTON_SX}
    />
  );
};
