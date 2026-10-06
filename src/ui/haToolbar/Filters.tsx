import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedTextFieldProps,
  Select,
  TextField,
  useMediaQuery,
} from "@mui/material";
import {ReactNode} from "react";
import useHaToolbarContext from "./useHaToolbarContext";

type TextFilterProps = Omit<OutlinedTextFieldProps, "variant"> & {
  label: ReactNode;
  source: string;
};

export const TextFilter = ({
  label,
  source,
  ...rest
}: Readonly<TextFilterProps>) => {
  const {currentFilter, setOneFilter} = useHaToolbarContext();
  const isSmall = useMediaQuery("(max-width:900px)");

  return (
    <TextField
      type="text"
      label={label}
      size="small"
      variant="outlined"
      value={currentFilter[source] || ""}
      sx={{width: "100%", minWidth: isSmall ? "100%" : "320px"}}
      onChange={(event) => setOneFilter(source, event.target.value)}
      {...rest}
    />
  );
};

// null is a real filter value: it selects the records without value
export type FilterChoiceId = string | number | null;

export interface FilterChoice {
  id: FilterChoiceId;
  name: string;
}

// mapToChoices builds its choices as plain string records
type FilterChoiceInput = FilterChoice | Record<string, string>;

type SelectFilterValues = Record<string, FilterChoiceId | undefined>;

interface SelectInputFilterProps {
  choices: ReadonlyArray<FilterChoiceInput>;
  label: ReactNode;
  source: string;
  name?: string;
  defaultValue?: FilterChoiceId;
  fullWidth?: boolean;
  // react-admin style props given by some callers, forwarded as is to the Select
  optionValue?: string;
  optionText?: string;
  helperText?: ReactNode;
}

export const SelectInputFilter = ({
  choices,
  label,
  source,
  ...props
}: Readonly<SelectInputFilterProps>) => {
  const {currentFilter = {}, setOneFilter} =
    useHaToolbarContext<SelectFilterValues>();
  const isSmall = useMediaQuery("(max-width:900px)");

  return (
    <FormControl sx={{width: "100%"}}>
      <InputLabel id="select-label" size="small" variant="outlined">
        {label}
      </InputLabel>
      <Select<FilterChoiceId>
        labelId="select-label"
        label={label}
        size="small"
        variant="outlined"
        value={currentFilter[source] || ""}
        sx={{minWidth: isSmall ? "100%" : "350px", my: 1}}
        fullWidth
        onChange={(event) => setOneFilter(source, event.target.value)}
        {...props}
      >
        {choices.map((choice) => (
          <MenuItem
            key={choice.id}
            // the li typing has no null, but the Select gives back this raw value
            value={choice.id as string | number}
            data-testid={`option-${choice.id}`}
          >
            {choice.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
