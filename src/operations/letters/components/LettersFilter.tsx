import {FC} from "react";
import {FilterForm, TextFilter, SelectInputFilter} from "@/ui/haToolbar";
import {LetterStatus} from "@haapi/typescript-client";

export const LettersFilter: FC = () => {
  return (
    <FilterForm>
      <TextFilter label="Référence Étudiant" source="student_ref" />
      <TextFilter label="Référence Lettre" source="letter_ref" />
      <SelectInputFilter
        label="Statut des Lettres"
        source="status"
        choices={[
          {id: LetterStatus.PENDING, name: "En attente"},
          {id: LetterStatus.RECEIVED, name: "Acceptée"},
          {id: LetterStatus.REJECTED, name: "Refusée"},
        ]}
      />
      <TextFilter label="Nom de l'Étudiant" source="student_name" />
    </FilterForm>
  );
};
