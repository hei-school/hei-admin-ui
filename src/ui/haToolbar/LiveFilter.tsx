import {FilledTextFieldProps, TextField} from "@mui/material";
import {useListFilterContext} from "ra-core";
import {ChangeEvent, ReactNode} from "react";

type LiveFilterProps = Omit<FilledTextFieldProps, "variant"> & {
  source: string;
  label: ReactNode;
};

export const LiveFilter = ({
  source,
  label,
  ...rest
}: Readonly<LiveFilterProps>) => {
  const {filterValues, setFilters} = useListFilterContext();
  const initialValues = filterValues[source] || "";
  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
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
};
