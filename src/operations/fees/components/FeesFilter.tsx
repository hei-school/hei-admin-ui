import {MonthToFilter} from "@/operations/fees/utils/MonthToFilter";
import {useRole} from "@/security/hooks";
import {
  DateTimeFilter,
  FilterForm,
  SelectInputFilter,
  TextFilter,
} from "@/ui/haToolbar";
import {Box, Divider, Typography} from "@mui/material";
import {
  FEE_STATUS_CHOICES,
  FEES_TYPES_CHOICES,
  MPBS_CHOICES,
} from "../constants";

export const FeesFilters = () => {
  const {isManager, isAdmin} = useRole();

  return (
    <FilterForm>
      {(isManager() || isAdmin()) && (
        <Box>
          <TextFilter
            label="Référence étudiante"
            source="student_ref"
            sx={{marginBottom: 2}}
            fullWidth
          />
          <SelectInputFilter
            data-testid="filter-fees-status"
            label="Statut du paiement du frais"
            source="status"
            choices={FEE_STATUS_CHOICES}
          />
          <SelectInputFilter
            data-testid="filter-fees-type"
            label="Type de frais"
            source="type"
            choices={FEES_TYPES_CHOICES}
          />
          <SelectInputFilter
            data-testid="filter-fees-transaction-status"
            label="Statut des transactions"
            source="transaction_status"
            choices={MPBS_CHOICES}
          />
        </Box>
      )}
      <Divider sx={{mt: 2, mb: 1}} />
      <Typography
        variant="body2"
        fontWeight="bold"
        color="#B4B5B7"
        sx={{mb: 1}}
      >
        Filtre par mois de limite de paiement
      </Typography>
      <DateTimeFilter
        label="Début"
        source="monthFrom"
        view={["month", "year"]}
        format="MM/YYYY"
      />
      <MonthToFilter />
    </FilterForm>
  );
};
