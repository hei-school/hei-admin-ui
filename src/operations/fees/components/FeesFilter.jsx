import {useListContext} from "react-admin";
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
import {FEESTEMPLATES_CHOICES} from "../feesTemplatesChoices";
import {MPBS_STATUS_LABEL} from "../utils";
import useHaToolbarContext from "@/ui/haToolbar/useHaToolbarContext";

export const FEE_STATUS = {
  LATE: "En retard",
  PAID: "Payés",
  UNPAID: "En cours",
};

const FEE_STATUS_CHOICES = mapToChoices(FEE_STATUS, "id", "name");
const FEES_TYPES_CHOICES = FEESTEMPLATES_CHOICES.map((choice) => ({
  name: choice.label,
  id: choice.value,
}));
const MPBS_CHOICES = mapToChoices(MPBS_STATUS_LABEL, "id", "name");

export const FeesFilters = () => {
  const {isManager, isAdmin} = useRole();

  const {filterValues} = useListContext();

  return (
    <FilterForm>
      {(isManager() || isAdmin()) && (
        <Box>
          <TextFilter label="Référence étudiante" source="student_ref" />
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
        sx={{mt: 2, mb: 1}}
      >
        Filtre par plage de date de limite de paiement
      </Typography>
      <DateTimeFilter label="Début" source="monthFrom" />
      <DateTimeFilter label="Fin" source="monthTo" />
    </FilterForm>
  );
};
