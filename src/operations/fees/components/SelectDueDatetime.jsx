import {Box} from "@mui/material";
import {SelectInput, TextInput, minValue, number, required} from "react-admin";

const DATETIME_FORMAT = new Intl.DateTimeFormat("fr-FR", {month: "long"});

const MONTHS_LISTS = Array.from({length: 12}, (_, month) => {
  return DATETIME_FORMAT.format(new Date(2023, month, 1));
});

const MONTHS_CHOICES = MONTHS_LISTS.map((month, index) => {
  return {
    label: month[0].toUpperCase() + month.slice(1),
    value: index,
  };
});

export function SelectDueDatetime() {
  const currentDate = new Date();

  return (
    <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
      <SelectInput
        label="Premier mois"
        name="predefinedMonth"
        source="predefinedMonth"
        data-testid="predefinedMonth"
        optionText="label"
        optionValue="value"
        choices={MONTHS_CHOICES}
        defaultValue={currentDate.getMonth()}
        validate={required()}
        sx={{flex: 2}}
      />
      <TextInput
        label="Année"
        inputProps={{
          "data-testid": "predefinedYear",
        }}
        source="predefinedYear"
        name="predefinedYear"
        validate={[required(), number(), minValue(2021)]}
        defaultValue={currentDate.getFullYear()}
        sx={{flex: 1}}
      />
    </Box>
  );
}
