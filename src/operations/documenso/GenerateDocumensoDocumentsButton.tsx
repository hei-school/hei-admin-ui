import {useNotify, useToggle} from "@/hooks";
import promotionDocumensoDocumentsProvider from "@/providers/promotionDocumensoDocumentsProvider";
import {Dialog} from "@/ui/components";
import {NoteAdd as GenerateIcon} from "@mui/icons-material";
import {Alert, Box} from "@mui/material";
import {useState} from "react";
import {Button, useRefresh} from "react-admin";

const BUTTON_SX = {py: "5px"};
const ALERT_SX = {mb: 2};
const ACTIONS_SX = {display: "flex", justifyContent: "flex-end", gap: 1};

export const GenerateDocumensoDocumentsButton = ({
  promotionId,
  promotionLabel,
  templateName,
}: {
  promotionId: string;
  promotionLabel: string;
  templateName: string;
}) => {
  const [isOpen, , toggleOpen] = useToggle();
  const [isGenerating, setIsGenerating] = useState(false);
  const notify = useNotify();
  const refresh = useRefresh();

  const launchGeneration = async () => {
    setIsGenerating(true);
    try {
      const [{studentCount}] =
        await promotionDocumensoDocumentsProvider.saveOrUpdate(
          [{templateName}],
          {promotionId}
        );
      notify(
        `Génération lancée pour ${studentCount} étudiant(s). Les fiches apparaîtront au fur et à mesure.`,
        {type: "success"}
      );
      toggleOpen();
      refresh();
    } catch {
      notify("Erreur lors du lancement de la génération", {type: "error"});
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Button
        onClick={toggleOpen}
        startIcon={<GenerateIcon />}
        label="GÉNÉRER"
        data-testid="generate-documenso-documents-button"
        variant="contained"
        sx={BUTTON_SX}
      />
      <Dialog
        title="Génération des fiches à signer"
        open={isOpen}
        onClose={toggleOpen}
      >
        <Alert severity="info" sx={ALERT_SX}>
          Une fiche <strong>{templateName}</strong> est créée pour chaque
          étudiant de la promotion <strong>{promotionLabel}</strong>, puis
          envoyée à son moniteur pour signature. Les étudiants qui en ont déjà
          une sont ignorés : l&apos;opération peut être relancée sans risque.
        </Alert>
        <Box sx={ACTIONS_SX}>
          <Button
            label="ANNULER"
            onClick={toggleOpen}
            disabled={isGenerating}
          />
          <Button
            label="LANCER"
            startIcon={<GenerateIcon />}
            data-testid="launch-generation-button"
            variant="contained"
            onClick={launchGeneration}
            disabled={isGenerating}
          />
        </Box>
      </Dialog>
    </>
  );
};
