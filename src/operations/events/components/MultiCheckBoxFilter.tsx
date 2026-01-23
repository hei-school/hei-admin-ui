import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  useMediaQuery,
} from "@mui/material";

type Choice = {
  id: string;
  name: string;
};

type MultiCheckboxFilterProps = {
  source: string;
  label?: string;
  choices: Choice[];
};

import {useContext} from "react";
import {HaToolbarContext} from "./../../../ui/haToolbar/FilterForm";

type HaToolbarContextType = {
  setCurrentFilter: React.Dispatch<React.SetStateAction<any>>;
  currentFilter: any;
  setOneFilter: (source: string, values: any) => void;
};

export const MultiCheckboxFilter = ({
  source,
  label,
  choices,
  ...props
}: MultiCheckboxFilterProps) => {
  const {currentFilter, setOneFilter} = useContext(
    HaToolbarContext
  ) as HaToolbarContextType;
  const isSmall = useMediaQuery("(max-width:900px)");

  const value: string[] = Array.isArray(currentFilter?.[source])
    ? currentFilter[source]
    : [];

  const handleChange = (event: any) => {
    const newValue = event.target.value;
    setOneFilter(source, newValue);
  };

  return (
    <FormControl sx={{width: "100%"}}>
      <InputLabel id={`${source}-label`} size="small" variant="outlined">
        {label}
      </InputLabel>

      <Select
        labelId={`${source}-label`}
        label={label}
        multiple
        size="small"
        variant="outlined"
        value={value}
        sx={{minWidth: isSmall ? "100%" : "350px", my: 1}}
        fullWidth
        onChange={handleChange}
        renderValue={(selected) =>
          choices
            .filter((c) => selected.includes(c.id))
            .map((c) => c.name)
            .join(", ")
        }
        {...props}
      >
        {choices.map((choice) => (
          <MenuItem
            key={choice.id}
            value={choice.id}
            data-testid={`option-${choice.id}`}
          >
            <Checkbox
              size={isSmall ? "small" : "medium"}
              checked={value.includes(choice.id)}
            />
            <ListItemText
              primary={choice.name}
              primaryTypographyProps={{
                fontSize: isSmall ? "0.75rem" : "0.85rem",
              }}
            />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
