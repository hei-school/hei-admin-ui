import {useNotify, useToggle} from "@/hooks";
import {Dialog} from "@/ui/components";
import {EmbedSignDocument} from "@documenso/embed-react";
import {DocumensoDocumentStatus} from "@haapi-3d601c85/typescript-client";
import {Draw as SignIcon} from "@mui/icons-material";
import {Alert, Box, Link} from "@mui/material";
import {useEffect, useState} from "react";
import {
  Button,
  useDataProvider,
  useRecordContext,
  useRefresh,
} from "react-admin";

const BUTTON_SX = {textTransform: "none"};
const EMBED_SX = {height: "80vh", width: "100%"};
const ALERT_SX = {mb: 2};

const DOCUMENSO_HOST = process.env.REACT_APP_DOCUMENSO_URL;

/*
 * Documenso rend ses erreurs de chargement dans l'iframe elle-même — un plan
 * sans signature intégrée répond 403 « embed-paywall ». Cette page n'émet aucun
 * postMessage : onDocumentError n'est jamais appelé et le dialogue reste sur un
 * cadre vide. On ne peut pas lire l'iframe (cross-origin), alors on se repose
 * sur onDocumentReady : passé ce délai sans signe de vie, on explique et on
 * propose la signature hors embed.
 */
const EMBED_READY_TIMEOUT_MS = 10_000;

export const SignDocumensoDocumentButton = () => {
  const record = useRecordContext();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();
  const [isOpen, setOpen] = useToggle();
  const [token, setToken] = useState<string | null>(null);
  const [isEmbedReady, setEmbedReady] = useState(false);
  const [hasTimedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!isOpen || !token || isEmbedReady) {
      return;
    }
    const timer = setTimeout(() => setTimedOut(true), EMBED_READY_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [isOpen, token, isEmbedReady]);

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
    try {
      const {
        data: {token: signingToken},
      } = await dataProvider.getOne("documenso-signing-tokens", {
        id: record.id,
      });
      setToken(signingToken);
      setOpen(true);
    } catch {
      notify("Impossible d'ouvrir la fiche à signer", {type: "error"});
    }
  };

  const closeSigning = () => {
    setToken(null);
    setEmbedReady(false);
    setTimedOut(false);
    setOpen(false);
  };

  /*
   * The signature is recorded by Documenso, not by us: our own status only
   * turns to COMPLETED once the webhook lands, so the list may still read
   * "en attente" for a moment after this dialog closes.
   */
  const onCompleted = () => {
    notify("Fiche signée. Sa mise à jour suit dans un instant.", {
      type: "success",
    });
    closeSigning();
    refresh();
  };

  const onRejected = () => {
    notify("Fiche refusée. Une nouvelle fiche pourra être générée.", {
      type: "warning",
    });
    closeSigning();
    refresh();
  };

  return (
    <>
      <Button
        onClick={openSigning}
        startIcon={<SignIcon />}
        label="Signer"
        data-testid="sign-documenso-document-button"
        variant="contained"
        sx={BUTTON_SX}
      />
      <Dialog
        title="Signature de la fiche"
        open={isOpen}
        onClose={closeSigning}
        maxWidth="lg"
      >
        {token && (
          <>
            {hasTimedOut && !isEmbedReady && (
              <Alert
                severity="warning"
                sx={ALERT_SX}
                data-testid="documenso-embed-unavailable"
              >
                La signature intégrée ne s&apos;est pas chargée. Elle peut être
                indisponible sur le plan Documenso de l&apos;organisation
                propriétaire de la fiche.{" "}
                <Link
                  href={`${DOCUMENSO_HOST}/sign/${token}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ouvrir la fiche directement sur Documenso
                </Link>
                .
              </Alert>
            )}
            <Box sx={EMBED_SX}>
              <EmbedSignDocument
                host={DOCUMENSO_HOST}
                token={token}
                allowDocumentRejection
                onDocumentReady={() => setEmbedReady(true)}
                onDocumentCompleted={onCompleted}
                onDocumentRejected={onRejected}
                onDocumentError={() =>
                  notify("Erreur pendant la signature", {type: "error"})
                }
              />
            </Box>
          </>
        )}
      </Dialog>
    </>
  );
};
