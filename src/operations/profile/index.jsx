import ProfileShow from "./ProfileShow";
import { FilterForm, SelectInputFilter, TextFilter } from "../../ui/haToolbar";
import { EnableStatus, Sex, WorkStudyStatus } from "@haapi/typescript-client";
import ProfileEdit from "./ProfileEdit";

const profile = {
  show: ProfileShow,
  edit: <ProfileEdit isOwnProfile />,
  options: { label: "Profil" },
};

export default profile;

export function ProfileFilters() {
  return (
    <FilterForm>
      <TextFilter
        data-testid="filter-profile-last_name"
        label="Nom·s"
        source="last_name"
      />
      <TextFilter
        data-testid="filter-profile-first_name"
        label="Prénom·s"
        source="first_name"
      />
      <TextFilter
        data-testid="filter-profile-ref"
        label="Référence"
        source="ref"
      />
      <SelectInputFilter
        data-testid="filter-profile-status"
        label="Statut"
        source="status"
        choices={[
          { id: EnableStatus.ENABLED, name: "Actif.ve" },
          { id: EnableStatus.SUSPENDED, name: "Suspendu.e" },
          { id: EnableStatus.DISABLED, name: "Quitté.e" },
          { id: null, name: "Aucune valeur" },
        ]}
      />
      <SelectInputFilter
        data-testid="filter-profile-sex"
        label="Sexe"
        source="sex"
        choices={[
          { id: Sex.M, name: "Homme" },
          { id: Sex.F, name: "Femme" },
          { id: null, name: "Aucune valeur" },
        ]}
      />
      <SelectInputFilter
        data-testid="filter-profile-work-status"
        label="Statut en alternance"
        source="work_study_status"
        choices={[
          {
            id: WorkStudyStatus.HAVE_BEEN_WORKING,
            name: "A été en alternance",
          },
          { id: WorkStudyStatus.WILL_BE_WORKING, name: "Sera en alternance" },
          { id: WorkStudyStatus.WORKING, name: "Est en alternance" },
          { id: null, name: "Aucune valeur" },
        ]}
      />
    </FilterForm>
  );
}
