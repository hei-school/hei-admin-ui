import {HaList} from "@/ui/haList";
import {Promotion, TemplateDocumenso} from "@haapi-b0fc7615/typescript-client";
import {Groups as PromotionIcon} from "@mui/icons-material";
import {Box} from "@mui/material";
import type {MouseEvent} from "react";
import {
  FunctionField,
  ShowButton,
  TextField,
  useRecordContext,
} from "react-admin";
import {GenerateDocumensoDocumentsButton} from "./GenerateDocumensoDocumentsButton";
import {levelOfTemplate, promotionLabel} from "./utils";

const ACTIONS_SX = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: 1.5,
};
const SHOW_SX = {borderRadius: 5, textTransform: "none", px: 2};

type SelectPromotion = (promotion: Promotion & {id: string}) => void;

const PromotionActions = ({
  templateName,
  onSelectPromotion,
}: {
  templateName: string;
  onSelectPromotion: SelectPromotion;
}) => {
  const promotion = useRecordContext<Promotion & {id: string}>();
  if (!promotion) {
    return null;
  }
  /*
   * ShowButton aims at /template-promotions/{id}/show, a route that does not exist: this view walks
   * through state, so the default navigation is held back.
   */
  const openDocuments = (event: MouseEvent) => {
    event.preventDefault();
    onSelectPromotion(promotion);
  };
  return (
    <Box sx={ACTIONS_SX}>
      <GenerateDocumensoDocumentsButton
        promotionId={promotion.id}
        promotionLabel={promotionLabel(promotion)}
        templateName={templateName}
      />
      <ShowButton
        onClick={openDocuments}
        label="Voir les fiches"
        data-testid="see-documenso-documents-button"
        variant="outlined"
        sx={SHOW_SX}
      />
    </Box>
  );
};

export const TemplatePromotionList = ({
  template,
  onSelectPromotion,
}: {
  template: TemplateDocumenso;
  onSelectPromotion: SelectPromotion;
}) => {
  const templateTitle = template.title ?? "";
  const level = levelOfTemplate(templateTitle);
  return (
    <HaList
      resource="template-promotions"
      title={
        level
          ? `Promotions ${level} — ${templateTitle}`
          : `Promotions — ${templateTitle}`
      }
      icon={<PromotionIcon />}
      wrapperSx={{marginTop: 0}}
      emptyListMessage={
        level
          ? `Aucune promotion en ${level} aujourd'hui`
          : "Aucune promotion à afficher"
      }
      actions={undefined}
      listProps={{title: " ", queryOptions: {meta: {level}}}}
      datagridProps={{
        "rowClick": false,
        "data-testid": "documenso-template-promotions-list",
      }}
    >
      <TextField source="ref" label="Référence" sortable={false} />
      <TextField source="name" label="Promotion" sortable={false} />
      <FunctionField
        label="Fiches"
        render={() => (
          <PromotionActions
            templateName={templateTitle}
            onSelectPromotion={onSelectPromotion}
          />
        )}
      />
    </HaList>
  );
};
