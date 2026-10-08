import {
  CircularProgress,
  MenuItem,
  OutlinedTextFieldProps,
  TextField,
} from "@mui/material";
import {ReactNode, useEffect, useState} from "react";
import useHaToolbarContext from "./useHaToolbarContext";
import {Items} from "./utils/Items";

type SelectFilterRecord = Record<string, unknown>;

// built by Items from the labelKey and valueKey paths of a record
export interface SelectFilterItem {
  label: unknown;
  value: unknown;
}

type SelectFilterProps = Omit<OutlinedTextFieldProps, "variant"> & {
  // either a pending request or the options themselves
  fetcher: Promise<{data: SelectFilterRecord[]}> | SelectFilterRecord[];
  source: string;
  label: ReactNode;
  valueKey: string;
  labelKey: string;
};

interface SelectFilterState {
  options: SelectFilterRecord[];
  pending: boolean;
}

type SelectFilterValues = Record<string, SelectFilterItem[] | undefined>;

export const SelectFilter = ({
  fetcher,
  source,
  label,
  valueKey,
  labelKey,
  ...rest
}: Readonly<SelectFilterProps>) => {
  const [data, setData] = useState<SelectFilterState>({
    options: [],
    pending: true,
  });
  const {currentFilter, setOneFilter} =
    useHaToolbarContext<SelectFilterValues>();
  const values = currentFilter[source] || [];
  const error = !data.pending && !data.options.length;

  useEffect(() => {
    if (!Array.isArray(fetcher))
      fetcher
        .then((response) => setData({options: response.data, pending: false}))
        .catch(() => setData({...data, pending: false}));
    else setData({options: fetcher, pending: false});
  }, []);

  const isChecked = (item: SelectFilterItem) =>
    values.some((el) => el.value === item.value);
  const toggleValue = (item: SelectFilterItem) => {
    const newFilter = !isChecked(item)
      ? [...values, item]
      : [...values].filter((el) => el.value !== item.value);
    setOneFilter(source, newFilter);
  };

  return (
    <TextField
      label={label}
      variant="outlined"
      value={values}
      size="small"
      select
      sx={{width: "100%", minWidth: "350px", boxSizing: "border-box"}}
      SelectProps={{
        multiple: true,
        // selected is the value given above: the list of the selected items
        renderValue: (selected) =>
          (selected as SelectFilterItem[]).map((el) => el.label).join(", "),
      }}
      {...rest}
    >
      {data.pending && (
        <MenuItem value="" sx={{backgroundColor: "white !important"}}>
          <CircularProgress style={{width: "20px", height: "20px"}} />
        </MenuItem>
      )}
      {error && (
        <MenuItem
          value=""
          sx={{
            fontSize: ".8em",
            width: "100%",
            backgroundColor: "white !important",
          }}
        >
          Une erreur c'est produite
        </MenuItem>
      )}
      <Items
        valueKey={valueKey}
        checked={isChecked}
        onClick={toggleValue}
        labelKey={labelKey}
        options={data.options}
      />
    </TextField>
  );
};
