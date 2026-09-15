import {Promotion, TemplateDocumenso} from "@haapi-b0fc7615/typescript-client";
import {Box, CircularProgress, Typography} from "@mui/material";
import {FileSignature, Home, Users} from "lucide-react";
import {useState} from "react";
import {CustomBreadcrumbs} from "../utils/CustomBreadcrumbs";
import {DocumensoTemplateList} from "./DocumensoTemplateList";
import {PromotionDocumensoDocumentList} from "./PromotionDocumensoDocumentList";
import {TemplatePromotionList} from "./TemplatePromotionList";
import {useSyncDocumensoTemplates} from "./useSyncDocumensoTemplates";
import {promotionLabel} from "./utils";

const LOADER_SX = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 2,
  py: 8,
};
/* the header band of the retake screens: the trail sits on its own, over a rule */
const CONTAINER_SX = {minHeight: "100vh", pb: 4, bgcolor: "#f8fafc"};
const HEADER_SX = {px: 2, pt: 2, pb: 1, borderBottom: "1px solid #e2e8f0"};
const BREADCRUMBS_SX = {mb: 2};
const CONTENT_SX = {px: 3, pt: 2};

type SelectedPromotion = Promotion & {id: string};

export const DocumensoDocumentsPage = () => {
  const [template, setTemplate] = useState<TemplateDocumenso | null>(null);
  const [promotion, setPromotion] = useState<SelectedPromotion | null>(null);
  const {isSyncing} = useSyncDocumensoTemplates();

  if (isSyncing) {
    return (
      <Box sx={LOADER_SX} data-testid="documenso-sync-loader">
        <CircularProgress size={24} />
        <Typography>Synchronisation des modèles Documenso…</Typography>
      </Box>
    );
  }

  const backToTemplates = () => {
    setPromotion(null);
    setTemplate(null);
  };

  if (template && promotion) {
    return (
      <Box sx={CONTAINER_SX}>
        <Box sx={HEADER_SX}>
          <CustomBreadcrumbs
            items={[
              {
                label: "Modèles de fiches",
                onClick: backToTemplates,
                icon: <Home size={16} />,
              },
              {
                label: template.title ?? "",
                onClick: () => setPromotion(null),
                icon: <FileSignature size={16} />,
              },
              {
                label: promotionLabel(promotion),
                isActive: true,
                icon: <Users size={16} />,
              },
            ]}
            sx={BREADCRUMBS_SX}
            variant="default"
          />
        </Box>
        <Box sx={CONTENT_SX}>
          <PromotionDocumensoDocumentList
            promotionId={promotion.id}
            templateTitle={template.title ?? ""}
          />
        </Box>
      </Box>
    );
  }

  if (template) {
    return (
      <Box sx={CONTAINER_SX}>
        <Box sx={HEADER_SX}>
          <CustomBreadcrumbs
            items={[
              {
                label: "Modèles de fiches",
                onClick: backToTemplates,
                icon: <Home size={16} />,
              },
              {
                label: template.title ?? "",
                isActive: true,
                icon: <FileSignature size={16} />,
              },
            ]}
            sx={BREADCRUMBS_SX}
            variant="default"
          />
        </Box>
        <Box sx={CONTENT_SX}>
          <TemplatePromotionList
            template={template}
            onSelectPromotion={setPromotion}
          />
        </Box>
      </Box>
    );
  }

  return <DocumensoTemplateList onSelect={setTemplate} />;
};
