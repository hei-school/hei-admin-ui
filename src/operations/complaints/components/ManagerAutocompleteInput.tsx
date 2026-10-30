import {Manager} from "@haapi-3d601c85/typescript-client";
import {Autocomplete, TextField} from "@mui/material";
import {useEffect, useState} from "react";
import {useDataProvider} from "react-admin";

interface Props {
  value: Manager | null;
  onChange: (manager: Manager | null) => void;
  label?: string;
}

export const ManagerAutocompleteInput = ({
  value,
  onChange,
  label = "Responsable",
}: Readonly<Props>) => {
  const dataProvider = useDataProvider();
  const [options, setOptions] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void dataProvider
      .getList<Manager & {id: string}>("managers", {
        pagination: {page: 1, perPage: 100},
        sort: {field: "id", order: "ASC"},
        filter: {},
      })
      .then((result) => setOptions(result.data))
      .finally(() => setLoading(false));
  }, [dataProvider]);

  const getOptionLabel = (option: Manager) =>
    `${option.first_name ?? ""} ${option.last_name ?? ""}`.trim();

  return (
    <Autocomplete
      options={options}
      loading={loading}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(option, selectedValue) =>
        option.id === selectedValue.id
      }
      noOptionsText="Aucun manager trouvé"
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
          fullWidth
          data-testid="manager-autocomplete"
          onClick={(e) => e.stopPropagation()}
        />
      )}
    />
  );
};
