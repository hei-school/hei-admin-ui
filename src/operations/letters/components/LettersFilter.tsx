import {FC} from "react";
import {FilterForm, TextFilter, SelectInputFilter} from "@/ui/haToolbar";
import {LetterStatus} from "@haapi/typescript-client";

export const LettersFilter: FC = () => {
  return (
    <FilterForm>
      <TextFilter label="Référence de l'utilisateur" source="student_ref" />
      <TextFilter
        label="Référence Lettre"
        source="letter_ref"
        data-testid="filter-letter-ref"
      />
      <SelectInputFilter
        label="Statut des Lettres"
        data-testid="filter-letter-status"
        source="status"
        choices={[
          {id: LetterStatus.PENDING, name: "En attente"},
          {id: LetterStatus.RECEIVED, name: "Acceptée"},
          {id: LetterStatus.REJECTED, name: "Refusée"},
        ]}
      />
      <TextFilter
        data-testid="filter-letter-first_name"
        label="Prénom de l'utilisateur"
        source="student_name"
      />
      <SelectInputFilter
        label="Type de lettre"
        source="is_linked_with_fee"
        choices={[
          {id: "PAYMENT_SLIP", name: "Bordereau"},
          {id: "ADMIN", name: "Lettre administrative"},
          {id: null, name: "Aucun"},
        ]}
      />
    </FilterForm>
  );
};
