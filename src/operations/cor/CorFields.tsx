import {DateField} from "@/operations/common/components/fields";
import {CorButtonAction} from "@/operations/cor/components/CorButtonAction";
import StatusChip from "@/operations/cor/components/StatusChip";
import {HaList} from "@/ui/haList";
import {Cor} from "@haapi-b0fc7615/typescript-client";
import {SafetyDivider} from "@mui/icons-material";
import {FC, ReactNode} from "react";
import {FunctionField, TextField} from "react-admin";

export const CorFields: FC<{
  resource: string;
  title: string;
  actions?: ReactNode | boolean;
}> = ({resource, title, actions = false}) => (
  <HaList
    resource={resource}
    title={title}
    emptyListMessage="La liste des C.O.R. est vide"
    icon={<SafetyDivider />}
    listProps={{
      className: "cor-list",
    }}
    actions={actions}
    datagridProps={{
      rowClick: false,
    }}
  >
    <TextField source="concerned_student.ref" label="Référence" />
    <TextField source="concerned_student.first_name" label="Prénom" />
    <TextField source="concerned_student.last_name" label="Nom" />
    <TextField source="description" label="Description" />
    <DateField source="interview_date" label="Date d'entretien" showTime />
    <DateField source="creation_datetime" label="Créé le" />
    <FunctionField<Cor>
      label="Statut"
      render={(cor) => {
        if (!cor) return null;
        return <StatusChip status={cor.status} />;
      }}
    />
    <FunctionField<Cor>
      label="Action"
      render={(cor) => {
        if (!cor) return null;
        return <CorButtonAction />;
      }}
    />
  </HaList>
);
