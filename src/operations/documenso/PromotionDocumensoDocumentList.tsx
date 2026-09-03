import {HaList} from "@/ui/haList";
import {
  DocumensoDocumentStatus,
  StudentLevel,
} from "@haapi-b0fc7615/typescript-client";
import {HistoryEdu as DocumensoIcon} from "@mui/icons-material";
import {FunctionField, SelectInput, TextField} from "react-admin";
import {DateField} from "../common/components/fields";
import {DocumensoDocumentStatusField} from "./DocumensoDocumentStatusField";
import {OpenSignedDocumentButton} from "./OpenSignedDocumentButton";

const LEVEL_CHOICES = Object.values(StudentLevel).map((level) => ({
  id: level,
  name: level,
}));

const STATUS_CHOICES = [
  {id: DocumensoDocumentStatus.PENDING, name: "En attente de signature"},
  {id: DocumensoDocumentStatus.COMPLETED, name: "Signée"},
  {id: DocumensoDocumentStatus.REJECTED, name: "Refusée"},
];

const FILTERS = [
  <SelectInput
    key="level"
    source="level"
    label="Niveau"
    choices={LEVEL_CHOICES}
    alwaysOn
  />,
  <SelectInput
    key="status"
    source="status"
    label="Statut"
    choices={STATUS_CHOICES}
    alwaysOn
  />,
];

export const PromotionDocumensoDocumentList = ({
  promotionId,
  templateTitle,
}: {
  promotionId: string;
  templateTitle?: string;
}) => (
  <HaList
    resource="promotions-documenso-documents"
    title="Fiches à signer"
    icon={<DocumensoIcon />}
    emptyListMessage="Aucune fiche générée pour cette promotion"
    actions={undefined}
    datagridProps={{rowClick: false}}
    listProps={{
      title: " ",
      filters: FILTERS,
      queryOptions: {meta: {promotionId, templateTitle}},
    }}
  >
    <TextField source="subject.ref" label="Référence" sortable={false} />
    <TextField source="subject.first_name" label="Prénom" sortable={false} />
    <TextField source="subject.last_name" label="Nom" sortable={false} />
    <TextField source="level" label="Niveau" sortable={false} />
    <TextField source="templateTitle" label="Modèle" sortable={false} />
    <FunctionField
      label="Statut"
      render={() => <DocumensoDocumentStatusField />}
    />
    <DateField source="completedDatetime" label="Signée le" showTime />
    <FunctionField
      label="Fiche signée"
      render={() => <OpenSignedDocumentButton />}
    />
  </HaList>
);
