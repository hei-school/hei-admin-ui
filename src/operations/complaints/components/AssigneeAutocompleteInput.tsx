import {Manager, StaffMember, Teacher} from "@haapi-3d601c85/typescript-client";
import {Autocomplete, TextField} from "@mui/material";
import {SyntheticEvent, useEffect, useState} from "react";
import {useDataProvider} from "react-admin";

const MIN_CHARS = 2;

interface AssigneeOption {
  id: string;
  first_name?: string;
  last_name?: string;
  role: string;
}

interface Props {
  value: string[];
  onChange: (userIds: string[]) => void;
  label?: string;
}

const toOptions = (
  users: Array<StaffMember | Teacher | Manager>,
  role: string
): AssigneeOption[] =>
  users.map((user) => ({
    id: user.id!,
    first_name: user.first_name,
    last_name: user.last_name,
    role,
  }));

export const AssigneeAutocompleteInput = ({
  value,
  onChange,
  label = "Assigner à",
}: Readonly<Props>) => {
  const dataProvider = useDataProvider();
  const [options, setOptions] = useState<AssigneeOption[]>([]);
  const [selected, setSelected] = useState<AssigneeOption[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  // selected is kept in sync with `value` by handleChange; this only resets
  // the display when the parent clears the selection externally (e.g. after submit)
  useEffect(() => {
    if (value.length === 0) setSelected([]);
  }, [value]);

  useEffect(() => {
    if (inputValue.length < MIN_CHARS) {
      setOptions([]);
      return;
    }
    setLoading(true);
    const timeout = setTimeout(() => {
      const pagination = {pagination: {page: 1, perPage: 25}};
      void Promise.all([
        dataProvider.getList<StaffMember & {id: string}>("staffmembers", {
          ...pagination,
          sort: {field: "id", order: "ASC"},
          filter: {first_name: inputValue},
        }),
        dataProvider.getList<Teacher & {id: string}>("teachers", {
          ...pagination,
          sort: {field: "id", order: "ASC"},
          filter: {first_name: inputValue},
        }),
        dataProvider.getList<Manager & {id: string}>("managers", {
          pagination: {page: 1, perPage: 100},
          sort: {field: "id", order: "ASC"},
          filter: {},
        }),
      ])
        .then(([staffResult, teacherResult, managerResult]) => {
          const matchingManagers = managerResult.data.filter((manager) =>
            `${manager.first_name ?? ""} ${manager.last_name ?? ""}`
              .toLowerCase()
              .includes(inputValue.toLowerCase())
          );
          setOptions([
            ...toOptions(staffResult.data, "Staff"),
            ...toOptions(teacherResult.data, "Enseignant"),
            ...toOptions(matchingManagers, "Manager"),
          ]);
        })
        .finally(() => setLoading(false));
    }, 400);
    return () => clearTimeout(timeout);
  }, [inputValue, dataProvider]);

  const getOptionLabel = (option: AssigneeOption) =>
    `${option.first_name ?? ""} ${option.last_name ?? ""}`.trim();

  const handleChange = (_: SyntheticEvent, newValue: AssigneeOption[]) => {
    setSelected(newValue);
    onChange(newValue.map((assignee) => assignee.id));
  };

  return (
    <Autocomplete
      multiple
      options={options}
      loading={loading}
      inputValue={inputValue}
      value={selected}
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      onChange={handleChange}
      getOptionLabel={getOptionLabel}
      groupBy={(option) => option.role}
      isOptionEqualToValue={(option, selectedValue) =>
        option.id === selectedValue.id
      }
      noOptionsText={
        inputValue.length < MIN_CHARS
          ? `Tapez au moins ${MIN_CHARS} caractères`
          : "Aucun résultat"
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
          fullWidth
          onClick={(e) => e.stopPropagation()}
        />
      )}
    />
  );
};
