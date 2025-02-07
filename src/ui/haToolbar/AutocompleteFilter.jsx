import {Autocomplete, TextField} from "@mui/material";
import {useEffect, useState} from "react";
import {getObjValue} from "../../utils";
import useHaToolbarContext from "./useHaToolbarContext";

export function AutocompleteFilter({
  source,
  label,
  fetcher,
  labelKey,
  valueKey,
  defaultKey,
  ...rest
}) {
  const {currentFilter, setOneFilter} = useHaToolbarContext();
  const [data, setData] = useState({
    options: [],
    pending: false,
    inputValue: "",
  });

  useEffect(() => fetchOptions(""), []);

  const fetchOptions = (inputValue) => {
    setData({...data, pending: true, inputValue});
    fetcher(inputValue === "" ? undefined : inputValue)
      .then((response) => {
        const newOptions = response.data.map((el) => {
          const label =
            getObjValue(el, labelKey) || getObjValue(el, defaultKey);
          const value = getObjValue(el, valueKey);
          return {label, value};
        });
        setData((prev) => ({...prev, options: newOptions, pending: false}));
      })
      .catch(() => setData((prev) => ({...prev, pending: false})));
  };

  const onInputChange = (event, value) => {
    if (!event) return;
    fetchOptions(value);
  };

  const onSelectChange = (event, value) => {
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
}
