import {FC, useState} from "react";
import {
  Select,
  MenuItem,
  SelectChangeEvent,
  FormControl,
  InputLabel,
} from "@mui/material";

interface Option {
  id: string;
  name: string;
}

interface SelectFieldProps {
  label: string;
  options: Option[];
  onChange: (value: string) => void;
}

export const SelectField: FC<SelectFieldProps> = ({
  label,
  options,
  onChange,
}) => {
  const [selectedValue, setSelectedValue] = useState<string | undefined>("");

  const handleChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSelectedValue(value);
    onChange(value);
  };

  return (
    <FormControl variant="outlined" sx={{flex: 1}} fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        value={selectedValue || ""}
        onChange={handleChange}
        sx={{borderRadius: 2}}
      >
        {options.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {option.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
