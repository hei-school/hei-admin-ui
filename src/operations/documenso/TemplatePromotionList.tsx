import {HaList} from "@/ui/haList";
import {Promotion, TemplateDocumenso} from "@haapi-b0fc7615/typescript-client";
import {Groups as PromotionIcon} from "@mui/icons-material";
import {FunctionField, TextField, useRecordContext} from "react-admin";
import {GenerateDocumensoDocumentsButton} from "./GenerateDocumensoDocumentsButton";
import {PromotionDocumensoDocumentList} from "./PromotionDocumensoDocumentList";

const promotionLabel = ({name, ref}: Promotion) =>
  [ref, name].filter(Boolean).join(" — ");

const PromotionDocuments = ({templateTitle}: {templateTitle: string}) => {
  const promotion = useRecordContext<Promotion & {id: string}>();
  if (!promotion) {
    return null;
  }
  return (
    <PromotionDocumensoDocumentList
      promotionId={promotion.id}
      templateTitle={templateTitle}
    />
  );
};

const GenerateForPromotion = ({templateName}: {templateName: string}) => {
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

export const TemplatePromotionList = ({
  template,
}: {
  template: TemplateDocumenso;
}) => {
  const templateTitle = template.title ?? "";
  return (
    <HaList
      resource="promotions"
      title={`Promotions — ${templateTitle}`}
      icon={<PromotionIcon />}
      emptyListMessage="Aucune promotion à afficher"
      actions={undefined}
      listProps={{title: " "}}
      datagridProps={{
        "rowClick": false,
        "expand": <PromotionDocuments templateTitle={templateTitle} />,
        "data-testid": "documenso-template-promotions-list",
      }}
    >
      <TextField source="ref" label="Référence" sortable={false} />
      <TextField source="name" label="Promotion" sortable={false} />
      <FunctionField
        label="Fiches"
        render={() => <GenerateForPromotion templateName={templateTitle} />}
      />
    </HaList>
  );
};
