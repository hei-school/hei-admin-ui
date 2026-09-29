import {HaList} from "@/ui/haList";
import {Promotion, TemplateDocumenso} from "@haapi-b0fc7615/typescript-client";
import {Groups as PromotionIcon} from "@mui/icons-material";
import type {MouseEvent} from "react";
import {ShowButton, TextField, useRecordContext} from "react-admin";
import {GenerateDocumensoDocumentsButton} from "./GenerateDocumensoDocumentsButton";
import {levelOfTemplate, promotionLabel} from "./utils";

type SelectPromotion = (promotion: Promotion & {id: string}) => void;

const GeneratePromotionDocumentsButton = ({
  templateName,
}: {
  templateName: string;
  label?: string;
}) => {
  const promotion = useRecordContext<Promotion & {id: string}>();
  if (!promotion) {
    return null;
  }
  return (
    <GenerateDocumensoDocumentsButton
      promotionId={promotion.id}
      promotionLabel={promotionLabel(promotion)}
      templateName={templateName}
    />
  );
};

const SeeDocumentsButton = ({
  onSelectPromotion,
}: {
  onSelectPromotion: SelectPromotion;
  label?: string;
}) => {
  const promotion = useRecordContext<Promotion & {id: string}>();
  if (!promotion) {
    return null;
  }
  const openDocuments = (event: MouseEvent) => {
    event.preventDefault();
    onSelectPromotion(promotion);
  };
  return (
    <ShowButton
      record={promotion}
      onClick={openDocuments}
      label="Afficher"
      data-testid="see-documenso-documents-button"
    />
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
      wrapperSx={{marginTop: 2}}
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
      <GeneratePromotionDocumentsButton
        templateName={templateTitle}
        label="Générer"
      />
      <SeeDocumentsButton onSelectPromotion={onSelectPromotion} />
    </HaList>
  );
};
