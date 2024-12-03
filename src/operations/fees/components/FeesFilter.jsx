import {Box, Divider, Typography} from "@mui/material";
import {FeeStatusEnum} from "@haapi/typescript-client";
import {useRole} from "@/security/hooks";
import {
  FilterForm,
  TextFilter,
  SelectInputFilter,
  DateTimeFilter,
} from "@/ui/haToolbar";
import {mapToChoices} from "@/utils";

export const FEE_STATUS = {
  LATE: "En retard",
  PAID: "Payés",
  UNPAID: "En attente",
};

const FEE_STATUS_CHOICES = mapToChoices(FEE_STATUS, "id", "name");

export const FeesFilterByStatus = () => (
  <SelectInputFilter
    data-testid="filter-fees-status"
    label="Statut"
    source="status"
    choices={FEE_STATUS_CHOICES}
  />
);

export const FeesFilters = () => {
  const {isManager, isAdmin} = useRole();

  return (
    <FilterForm>
      <FeesFilterByStatus />
      {(isManager() || isAdmin()) && (
        <TextFilter label="Référence étudiante" source="student_ref" />
      )}
      <Divider sx={{mt: 2, mb: 1}} />
      <Typography
        variant="body2"
        fontWeight="bold"
        color="#B4B5B7"
        sx={{mt: 2, mb: 1}}
      >
        Filtre par plage de date de limite de paiement
      </Typography>
      <DateTimeFilter label="Début" source="monthFrom" />
      <DateTimeFilter label="Fin" source="monthTo" />
    </FilterForm>
  );
};
