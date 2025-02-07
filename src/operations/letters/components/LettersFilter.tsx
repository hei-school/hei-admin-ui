import {useRole} from "@/security/hooks";
import {FilterForm, SelectInputFilter, TextFilter} from "@/ui/haToolbar";
import {LetterStatus, RoleParamEnum} from "@haapi/typescript-client";
import {FC} from "react";

export const LettersFilter: FC = () => {
  const {isAdmin} = useRole();
  return (
    <FilterForm>
      <TextFilter label="Référence de l'utilisateur" source="student_ref" />
      <TextFilter
        label="Référence de la lettre"
        source="letter_ref"
        data-testid="filter-letter-ref"
      />
      <SelectInputFilter
        label="Statut des lettres "
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
      {isAdmin() ? (
        <SelectInputFilter
          choices={[
            {id: RoleParamEnum.TEACHER, name: "Enseignant(e)"},
            {id: RoleParamEnum.STUDENT, name: "Étudiant(e)"},
            {id: RoleParamEnum.STAFF_MEMBER, name: "Membre du staff"},
          ]}
          label="Utilisateurs"
          source="role"
        />
      ) : null}
    </FilterForm>
  );
};
