import {HaList} from "@/ui/haList";
import {HistoryEdu as DocumensoIcon} from "@mui/icons-material";
import {FunctionField, TextField} from "react-admin";
import {useParams} from "react-router-dom";
import {DateField} from "../common/components/fields";
import {DocumensoDocumentStatusField} from "./DocumensoDocumentStatusField";
import {OpenSignedDocumentButton} from "./OpenSignedDocumentButton";
import {SignDocumensoDocumentButton} from "./SignDocumensoDocumentButton";

export const MonitorDocumensoDocumentList = () => {
  const {monitorId} = useParams();

  return (
    <HaList
      resource="monitors-documenso-documents"
      title="Fiches de mes étudiants"
      icon={<DocumensoIcon />}
      datagridProps={{rowClick: false}}
      listProps={{
        title: " ",
        queryOptions: {meta: {monitorId}},
      }}
      actions={false}
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
        label="Signature"
        render={() => <SignDocumensoDocumentButton />}
      />
      <FunctionField
        label="Fiche signée"
        render={() => <OpenSignedDocumentButton />}
      />
    </HaList>
  );
};
