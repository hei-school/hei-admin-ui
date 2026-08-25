import {Student} from "@haapi-3d601c85/typescript-client";
import {Autocomplete, TextField} from "@mui/material";
import {useEffect, useState} from "react";
import {useDataProvider, useInput} from "react-admin";

interface StudentAutocompleteInputProps {
  source: string;
  label?: string;
  fullWidth?: boolean;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
}

export const StudentAutocompleteInput = (
  props: StudentAutocompleteInputProps
) => {
  const {
    source,
    label = "Étudiant",
    fullWidth = true,
    required = false,
    disabled = false,
    helperText,
  } = props;

  const dataProvider = useDataProvider();
  const {field} = useInput({source});

  const [options, setOptions] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    if (field.value) {
      dataProvider
        .getOne("students", {id: field.value})
        .then((result) => {
          setSelectedStudent(result.data);
        })
        .catch(console.error);
    }
  }, [field.value, dataProvider]);

  const fetchStudents = async (searchText: string) => {
    if (searchText.length < 2) {
      setOptions([]);
      return;
    }

    setLoading(true);
    try {
      const result = await dataProvider.getList("students", {
        pagination: {page: 1, perPage: 25},
        sort: {field: "ref", order: "ASC"},
        filter: {ref: searchText},
      });
      setOptions(result.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchStudents(inputValue);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  const handleInputChange = (_event: any, newInputValue: string) => {
    setInputValue(newInputValue);
  };

  const handleChange = (_event: any, newValue: any) => {
    setSelectedStudent(newValue);
    field.onChange(newValue ? newValue.id : null);
  };

  return (
    <Autocomplete
      data-testid="student-autocomplete"
      options={options}
      loading={loading}
      inputValue={inputValue}
      value={selectedStudent}
      onInputChange={handleInputChange}
      onChange={handleChange}
      getOptionLabel={(option) => option.ref || ""}
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
        inputValue.length < 2
          ? "Tapez au moins 2 caractères"
          : "Aucun étudiant trouvé"
      }
    />
  );
};
