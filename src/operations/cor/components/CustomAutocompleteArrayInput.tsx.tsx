import {Autocomplete, TextField} from "@mui/material";
import {useEffect, useState} from "react";
import {useDataProvider, useInput} from "react-admin";

interface AutocompleteArrayInputProps {
  source: string;
  resource: string;
  label?: string;
  fullWidth?: boolean;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  // fields to search by (backend should interpret filter accordingly)
  searchFields?: string[]; // e.g. ['firstname', 'lastname']
  // function to derive option label from record
  optionLabel?: (record: any) => string;
  minChars?: number;
  perPage?: number;
  sort?: {field: string; order: "ASC" | "DESC"};
}

export const CustomAutocompleteArrayInput = (
  props: AutocompleteArrayInputProps
) => {
  const {
    source,
    resource,
    label,
    fullWidth = true,
    required = false,
    disabled = false,
    helperText,
    searchFields = ["firstname", "lastname"],
    optionLabel,
    minChars = 2,
    perPage = 25,
    sort = {field: "id", order: "ASC"},
  } = props;

  const dataProvider = useDataProvider();
  const {field} = useInput({source});

  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);

  // derive label if not provided
  const getOptionLabel = (opt: any) => {
    if (!opt) return "";
    if (optionLabel) return optionLabel(opt);
    const fn = opt.firstname || opt.first_name || "";
    const ln = opt.lastname || opt.last_name || "";
    const combined = `${fn} ${ln}`.trim();
    return combined || opt.id || "";
  };

  // load initial selected records (field.value expected to be array of ids)
  useEffect(() => {
    const ids = Array.isArray(field.value) ? field.value : [];
    if (ids.length === 0) {
      setSelectedOptions([]);
      return;
    }
    let mounted = true;
    dataProvider
      .getMany(resource, {ids})
      .then((res: any) => {
        if (!mounted) return;
        setSelectedOptions(res.data || []);
      })
      .catch((err: any) => {
        console.error("Error loading selected options:", err);
      });
    return () => {
      mounted = false;
    };
  }, [field.value, dataProvider, resource]);

  const fetchResources = async (searchText: string) => {
    if (searchText.length < minChars) {
      setOptions([]);
      return;
    }

    setLoading(true);
    try {
      // build filter object: set each searchField to the searchText
      const filter = searchFields.reduce((acc: any, f) => {
        acc[f] = searchText;
        return acc;
      }, {});
      const result = await dataProvider.getList(resource, {
        pagination: {page: 1, perPage},
        sort,
        filter,
      });
      setOptions(result.data || []);
    } catch (error) {
      console.error("Error fetching resources:", error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  // debounce input
  useEffect(() => {
    const t = setTimeout(() => {
      fetchResources(inputValue);
    }, 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  const handleInputChange = (_event: any, newInputValue: string) => {
    setInputValue(newInputValue);
  };

  const handleChange = (_event: any, newValue: any[]) => {
    setSelectedOptions(newValue || []);
    // send array of ids to the backend (or null if empty)
    const ids = (newValue || []).map((v) => v.id);
    field.onChange(ids);
  };

  return (
    <Autocomplete
      multiple
      data-testid="autocomplete-array-input"
      options={options}
      loading={loading}
      inputValue={inputValue}
      value={selectedOptions}
      onInputChange={handleInputChange}
      onChange={handleChange}
      getOptionLabel={(option) => getOptionLabel(option)}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
          fullWidth={fullWidth}
          required={required}
          disabled={disabled}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <div>Chargement...</div> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      fullWidth={fullWidth}
      noOptionsText={
        inputValue.length < minChars
          ? `Tapez au moins ${minChars} caractères`
          : "Aucun résultat"
      }
    />
  );
};
