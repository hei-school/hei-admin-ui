import {useRole} from "@/security/hooks";
import {
  DateTimeFilter,
  FilterForm,
  SelectInputFilter,
  TextFilter,
} from "@/ui/haToolbar";
import {Box, Divider, Typography} from "@mui/material";
import React from "react";
import {useListContext} from "react-admin";
import {
  FEE_STATUS_CHOICES,
  FEES_TYPES_CHOICES,
  MPBS_CHOICES,
} from "../constants";

interface FeesFilterProps {
  onStatusChange?: (status: string) => void;
}

export const FeesFilters: React.FC<FeesFilterProps> = ({onStatusChange}) => {
  const {isManager, isAdmin} = useRole();
  const {filterValues, setFilters, displayedFilters} = useListContext();

  const handleStatusChange = (event: React.ChangeEvent<{value: unknown}>) => {
    const newStatus = event.target.value as string;
    setFilters({...filterValues, status: newStatus}, displayedFilters, false);
    if (onStatusChange) {
      onStatusChange(newStatus);
    }
  };

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
            value={filterValues.status || ""}
            onChange={handleStatusChange}
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
