import {TemplateDocumenso} from "@haapi-b0fc7615/typescript-client";
import {ArrowBack as BackIcon} from "@mui/icons-material";
import {Box, CircularProgress, Typography} from "@mui/material";
import {useState} from "react";
import {Button} from "react-admin";
import {DocumensoTemplateList} from "./DocumensoTemplateList";
import {TemplatePromotionList} from "./TemplatePromotionList";
import {useSyncDocumensoTemplates} from "./useSyncDocumensoTemplates";

const LOADER_SX = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 2,
  py: 8,
};
const BACK_SX = {mt: 2};

export const DocumensoDocumentsPage = () => {
  const [template, setTemplate] = useState<TemplateDocumenso | null>(null);
  const {isSyncing} = useSyncDocumensoTemplates();

  if (isSyncing) {
    return (
      <Box sx={LOADER_SX} data-testid="documenso-sync-loader">
        <CircularProgress size={24} />
        <Typography>Synchronisation des modèles Documenso…</Typography>
      </Box>
    );
  }

  if (template) {
    return (
      <Box>
        <Button
          onClick={() => setTemplate(null)}
          startIcon={<BackIcon />}
          label="RETOUR AUX MODÈLES"
          data-testid="back-to-documenso-templates-button"
          sx={BACK_SX}
        />
        <TemplatePromotionList template={template} />
      </Box>
    );
  }

  return <DocumensoTemplateList onSelect={setTemplate} />;
};
