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

import useHaToolbarContext from "@/ui/haToolbar/useHaToolbarContext";
import {useState} from "react";

type MultiCheckboxFilterValues = Record<string, string[] | undefined>;

export const MultiCheckboxFilter = ({
  source,
  label,
  choices,
  ...props
}: MultiCheckboxFilterProps) => {
  const {currentFilter, setOneFilter} =
    useHaToolbarContext<MultiCheckboxFilterValues>();

  const isSmall = useMediaQuery("(max-width:900px)");
  const [open, setOpen] = useState(false);

  const selectedValues = currentFilter?.[source];
  const value: string[] = Array.isArray(selectedValues) ? selectedValues : [];

  const toggleValue = (id: string) => {
    const newValue = value.includes(id)
      ? value.filter((v) => v !== id)
      : [...value, id];

    setOneFilter(source, newValue);
    setOpen(false);
  };

  return (
    <FormControl sx={{width: "100%"}}>
      <InputLabel id={`${source}-label`} size="small">
        {label}
      </InputLabel>

      <Select
        labelId={`${source}-label`}
        label={label}
        multiple
        size="small"
        variant="outlined"
        value={value}
        fullWidth
        sx={{minWidth: isSmall ? "100%" : "350px", my: 1}}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
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
            onClick={() => toggleValue(choice.id)}
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
