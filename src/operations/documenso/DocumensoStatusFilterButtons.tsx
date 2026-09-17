import {DocumensoDocumentStatus} from "@haapi-b0fc7615/typescript-client";
import {Button, ButtonProps, Stack} from "@mui/material";
import {useListContext} from "react-admin";

const STATUS_FILTERS: {
  label: string;
  value?: DocumensoDocumentStatus;
  color: ButtonProps["color"];
}[] = [
  {label: "Toutes", color: "primary"},
  {
    label: "En attente",
    value: DocumensoDocumentStatus.PENDING,
    color: "warning",
  },
  {
    label: "Signées",
    value: DocumensoDocumentStatus.COMPLETED,
    color: "success",
  },
  {label: "Refusées", value: DocumensoDocumentStatus.REJECTED, color: "error"},
];

export const DocumensoStatusFilterButtons = () => {
  const {filterValues, setFilters} = useListContext();
  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      {STATUS_FILTERS.map((filter) => {
        const applyFilter = () => {
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
            onClick={applyFilter}
            sx={{borderRadius: 5, textTransform: "none", minWidth: "5rem"}}
          >
            {filter.label}
          </Button>
        );
      })}
    </Stack>
  );
};
