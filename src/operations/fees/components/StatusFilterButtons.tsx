import {FeeStatusEnum} from "@haapi-b0fc7615/typescript-client";
import {Button, Stack} from "@mui/material";
import {useListContext} from "react-admin";

const STATUS_FILTERS = [
  {label: "En retard", value: FeeStatusEnum.LATE},
  {label: "En cours", value: FeeStatusEnum.PENDING},
  {label: "Payés", value: FeeStatusEnum.PAID},
  {label: "Non payés", value: FeeStatusEnum.UNPAID},
];

export const StatusFilterButtons = () => {
  const {filterValues, setFilters} = useListContext();

  return (
    <Stack direction="row" spacing={1} sx={{mb: 1, px: 2}}>
      {STATUS_FILTERS.map((filter) => (
        <Button
          key={filter.value}
          size="small"
          variant={
            filterValues.status === filter.value ? "contained" : "outlined"
          }
          onClick={() =>
            setFilters({...filterValues, status: filter.value}, {})
          }
          sx={{borderRadius: 5, textTransform: "none"}}
        >
          {filter.label}
        </Button>
      ))}
    </Stack>
  );
};
