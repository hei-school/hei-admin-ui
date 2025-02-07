import {Autocomplete, TextField} from "@mui/material";
import {useState} from "react";
import {Controller} from "react-hook-form";

export const CustomAutoComplete = ({
  data,
  control,
  name,
  label,
  onInputChange,
  ...props
}) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <Controller
      control={control}
      name={name}
      render={({field: {onChange, value}}) => (
        <Autocomplete
          {...props}
          options={data}
          noOptionsText="Aucune option"
          getOptionLabel={(option) => option.ref}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(event, newValue) => onChange(newValue)}
          value={value}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
            onInputChange(newInputValue);
          }}
          renderInput={(params) => <TextField {...params} label={label} />}
        />
      )}
    />
  );
};
