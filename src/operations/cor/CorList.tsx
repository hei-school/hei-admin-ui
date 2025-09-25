import {DateField} from "@/operations/common/components/fields";
import {CorButtonAction} from "@/operations/cor/components/CorButtonAction";
import StatusChip from "@/operations/cor/components/StatusChip";
import {HaList} from "@/ui/haList";
import {Cor} from "@haapi-b0fc7615/typescript-client";
import {SafetyDivider} from "@mui/icons-material";
import {FunctionField, TextField} from "react-admin";

export const CorList = () => {
  return (
    <HaList
      resource="cor"
      title="Liste des COR"
      icon={<SafetyDivider />}
      actions={null}
      datagridProps={{
        rowClick: false,
      }}
      mainSearch={{label: "Référence étudiant", source: "student_ref"}}
    >
      <TextField source="concerned_student.ref" label="Référence" />
      <TextField source="concerned_student.first_name" label="Prénom" />
      <TextField source="concerned_student.last_name" label="Nom" />
      <TextField source="description" label="Description" />
      <DateField source="interview_date" label="Date d'entretien" showTime />
      <DateField source="creation_datetime" label="Créé le" />
      <FunctionField<Cor>
        label="Statut"
        render={(record?: Cor) => {
          if (!record) return null;
          return <StatusChip status={record.status} />;
        }}
      />
      <FunctionField<Cor>
        label="Actions"
        render={() => <CorButtonAction />}
        sx={{textAlign: "right"}}
      />
    </HaList>
  );
};
