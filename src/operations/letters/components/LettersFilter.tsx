import {useRole} from "@/security/hooks";
import {FilterForm, SelectInputFilter, TextFilter} from "@/ui/haToolbar";
import {LetterStatus, RoleEnum} from "@haapi-b0fc7615/typescript-client";
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
          {id: LetterStatus.REJECTED, name: "Invalide"},
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
            {id: RoleEnum.TEACHER, name: "Enseignant(e)"},
            {id: RoleEnum.STUDENT, name: "Étudiant(e)"},
            {id: RoleEnum.STAFF_MEMBER, name: "Membre du staff"},
          ]}
          label="Utilisateurs"
          source="role"
        />
      ) : null}
    </FilterForm>
  );
};
