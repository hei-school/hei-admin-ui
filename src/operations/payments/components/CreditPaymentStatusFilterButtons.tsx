import {PaymentStatus} from "@haapi-b0fc7615/typescript-client";
import {Button, ButtonProps, Stack} from "@mui/material";
import {useListContext} from "react-admin";

const STATUS_FILTERS: {
  label: string;
  value?: PaymentStatus;
  color: ButtonProps["color"];
}[] = [
  {label: "Tous", color: "primary"},
  {label: "En attente", value: PaymentStatus.CREATED, color: "warning"},
  {label: "Validés", value: PaymentStatus.VALIDATE, color: "success"},
  {label: "Rejetés", value: PaymentStatus.INVALIDATE, color: "error"},
];

export const CreditPaymentStatusFilterButtons = () => {
  const {filterValues, setFilters} = useListContext();
  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      {STATUS_FILTERS.map((filter) => {
        const onClick = () => {
          const nextFilters = {...filterValues, status: filter.value};
          if (!filter.value) {
            delete nextFilters.status;
          }
          setFilters(nextFilters, {});
        };
        return (
          <Button
            key={filter.label}
            size="small"
            color={filter.color}
            variant={
              filterValues.status === filter.value ? "contained" : "outlined"
            }
            onClick={onClick}
            sx={{borderRadius: 5, textTransform: "none", minWidth: "5rem"}}
          >
            {filter.label}
          </Button>
        );
      })}
    </Stack>
  );
};
