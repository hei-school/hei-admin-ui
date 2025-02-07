import {
  DateTimeFilter,
  FilterForm,
  SelectInputFilter,
  TextFilter,
} from "@/ui/haToolbar";
import {EnableStatus, Sex, WorkStudyStatus} from "@haapi/typescript-client";
import {Box} from "@mui/material";

export function ProfileFilters({resource}) {
  return (
    <FilterForm>
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
          {id: EnableStatus.ENABLED, name: "Actif.ve"},
          {id: EnableStatus.SUSPENDED, name: "Suspendu.e"},
          {id: EnableStatus.DISABLED, name: "Quitté.e"},
          {id: null, name: "Aucune valeur"},
        ]}
      />
      <SelectInputFilter
        data-testid="filter-profile-sex"
        label="Sexe"
        source="sex"
        choices={[
          {id: Sex.M, name: "Homme"},
          {id: Sex.F, name: "Femme"},
          {id: null, name: "Aucune valeur"},
        ]}
      />
      {resource === "students" && (
        <Box width="100%">
          <SelectInputFilter
            data-testid="filter-profile-work-status"
            label="Statut professionnel"
            source="work_study_status"
            choices={[
              {
                id: WorkStudyStatus.HAVE_BEEN_WORKING,
                name: "A eu une expérience professionnelle",
              },
              {
                id: WorkStudyStatus.WILL_BE_WORKING,
                name: "Aura une expérience professionnelle",
              },
              {
                id: WorkStudyStatus.WORKING,
                name: "A une expérience professionnelle",
              },
              {id: null, name: "Aucune valeur"},
            ]}
          />
          <DateTimeFilter
            label="Date de début de l'expérience professionnelle"
            source="commitment_begin_date"
            style={{margin: "1rem 0"}}
          />
        </Box>
      )}
    </FilterForm>
  );
}
