import {HaList} from "@/ui/haList";
import {HistoryEdu as DocumensoIcon} from "@mui/icons-material";
import {FunctionField, TextField} from "react-admin";
import {DateField} from "../common/components/fields";
import {DocumensoDocumentStatusField} from "./DocumensoDocumentStatusField";
import {DocumensoStatusFilterButtons} from "./DocumensoStatusFilterButtons";
import {OpenSignedDocumentButton} from "./OpenSignedDocumentButton";

/*
 * No level filter: the template reached to get this far already names one, so every fiche listed
 * sits at it.
 */
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
    wrapperSx={{marginTop: 0}}
    emptyListMessage="Aucune fiche générée pour cette promotion"
    actions={undefined}
    filterButtons={<DocumensoStatusFilterButtons />}
    datagridProps={{rowClick: false}}
    listProps={{
      title: " ",
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
