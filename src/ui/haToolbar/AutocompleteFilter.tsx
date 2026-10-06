import {Autocomplete, AutocompleteProps, TextField} from "@mui/material";
import {ReactNode, SyntheticEvent, useEffect, useState} from "react";
import {getObjValue} from "../../utils";
import useHaToolbarContext from "./useHaToolbarContext";

export interface AutocompleteFilterOption {
  label: string;
  value: string;
}

type AutocompleteFilterProps = Omit<
  AutocompleteProps<AutocompleteFilterOption, true, false, false>,
  "options" | "renderInput"
> & {
  source: string;
  label: ReactNode;
  fetcher: (
    inputValue: string | undefined
  ) => Promise<{data: Record<string, unknown>[]}>;
  // paths read with getObjValue, they point to text fields of the fetched records
  labelKey: string;
  valueKey: string;
  defaultKey: string;
};

interface AutocompleteFilterState {
  options: AutocompleteFilterOption[];
  pending: boolean;
  inputValue: string;
}

type AutocompleteFilterValues = Record<
  string,
  AutocompleteFilterOption[] | undefined
>;

export const AutocompleteFilter = ({
  source,
  label,
  fetcher,
  labelKey,
  valueKey,
  defaultKey,
  ...rest
}: Readonly<AutocompleteFilterProps>) => {
  const {currentFilter, setOneFilter} =
    useHaToolbarContext<AutocompleteFilterValues>();
  const [data, setData] = useState<AutocompleteFilterState>({
    options: [],
    pending: false,
    inputValue: "",
  });

  useEffect(() => fetchOptions(""), []);

  const fetchOptions = (inputValue: string) => {
    setData({...data, pending: true, inputValue});
    fetcher(inputValue === "" ? undefined : inputValue)
      .then((response) => {
        const newOptions = response.data.map((el) => {
          const label = (getObjValue(el, labelKey) ||
            getObjValue(el, defaultKey)) as string;
          const value = getObjValue(el, valueKey) as string;
          return {label, value};
        });
        setData((prev) => ({...prev, options: newOptions, pending: false}));
      })
      .catch(() => setData((prev) => ({...prev, pending: false})));
  };

  const onInputChange = (event: SyntheticEvent, value: string) => {
    if (!event) return;
    fetchOptions(value);
  };

  const onSelectChange = (
    _event: SyntheticEvent,
    value: AutocompleteFilterOption[]
  ) => {
    setOneFilter(source, value);
    setData((prev) => ({...prev, inputValue: ""}));
  };

  return (
    <Autocomplete
      loadingText="Chargement..."
      multiple
      sx={{width: "100%"}}
      loading={data.pending}
      options={data.options}
      inputValue={data.inputValue}
      value={currentFilter[source] || []}
      onInputChange={onInputChange}
      onChange={onSelectChange}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option1, option2) =>
        option1.value === option2.value
      }
      renderOption={(props, option) => (
        <li {...props} key={option.value}>
          {option.label}
        </li>
      )}
      renderInput={(params) => (
        <TextField {...params} label={label} variant="outlined" />
      )}
      {...rest}
    />
  );
};
