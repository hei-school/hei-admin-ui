import {TextField} from "@mui/material";
import {useListFilterContext} from "ra-core";

export function LiveFilter({source, label, ...rest}) {
  const {filterValues, setFilters} = useListFilterContext();
  const initialValues = filterValues[source] || "";
  const handleChange = (event) =>
    setFilters({...filterValues, [source]: event.target.value}, null);

  return (
    <TextField
      size="small"
      variant="filled"
      sx={{width: "220px"}}
      hiddenLabel={false}
      label={label}
      defaultValue={initialValues}
      onChange={handleChange}
      {...rest}
    />
  );
}
