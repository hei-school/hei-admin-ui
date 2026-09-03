import {Teacher} from "@haapi-b0fc7615/typescript-client";
import {Autocomplete, TextField} from "@mui/material";
import {useEffect, useState} from "react";
import {useDataProvider, useInput} from "react-admin";

interface Props {
  resource: string;
  source: string;
  label?: string;
  fullWidth?: boolean;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  searchFields?: string[]; // fields to search on backend (default: ['first_name'] => recherche par prénom seulement)
  optionLabel?: (record: any) => string;
  minChars?: number;
  perPage?: number;
  sort?: {field: string; order: "ASC" | "DESC"};
}

export const CustomAutocompleteArrayInput = (props: Props) => {
  const {
    resource,
    source,
    label,
    fullWidth = true,
    required = false,
    disabled = false,
    helperText,
    searchFields = ["first_name"],
    optionLabel,
    minChars = 2,
    perPage = 25,
    sort = {field: "id", order: "ASC"},
  } = props;

  const dataProvider = useDataProvider();
  const {field} = useInput({source});

  const [options, setOptions] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selected, setSelected] = useState<Teacher[]>([]);

  const normalizeGetOneResult = (res: any) => {
    if (!res) return null;
    return res.data ?? res;
  };

  useEffect(() => {
    const ids = Array.isArray(field.value) ? field.value.filter(Boolean) : [];
    if (ids.length === 0) {
      setSelected([]);
      return;
    }
    let mounted = true;
    (async () => {
      try {
        const promises = ids.map((id) =>
          dataProvider.getOne(resource, {id}).then(normalizeGetOneResult)
        );
        const results = await Promise.all(promises);
        if (!mounted) return;
        setSelected(results.filter(Boolean));
      } catch (err) {
        console.error("Error loading selected options:", err);
      }
    })();
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
      const filter = searchFields.reduce((acc: any, f) => {
        acc[f] = searchText;
        return acc;
      }, {});
      const result = await dataProvider.getList(resource, {
        pagination: {page: 1, perPage},
        sort,
        filter,
      });
      const data = result?.data ?? result;
      setOptions(data || []);
    } catch (err) {
      console.error("Error fetching resources:", err);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => {
      fetchResources(inputValue);
    }, 400);
    return () => clearTimeout(t);
  }, [inputValue]);

  const getOptionLabel = (opt: any) => {
    if (!opt) return "";
    if (optionLabel) return optionLabel(opt);
    const fn = opt.first_name || opt.firstname || opt.firstName || "";
    const ln = opt.last_name || opt.lastname || opt.lastName || "";
    return `${fn} ${ln}`.trim() || opt.id || "";
  };

  const handleInputChange = (_: any, newInputValue: string) => {
    setInputValue(newInputValue);
  };

  const handleChange = (_: any, newValue: any[]) => {
    const vals = newValue || [];
    setSelected(vals);
    const ids = vals.map((v) => v.id);
    field.onChange(ids);
  };

  return (
    <Autocomplete
      data-testid="custom-autocomplete-array-input"
      multiple
      options={options}
      loading={loading}
      inputValue={inputValue}
      value={selected}
      onInputChange={handleInputChange}
      onChange={handleChange}
      getOptionLabel={(option) => getOptionLabel(option)}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
          sx={{
            mt: 2,
          }}
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

export default CustomAutocompleteArrayInput;
