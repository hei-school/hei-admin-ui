import {FilterListItemClasses, useListFilterContext} from "react-admin";
import {
  IconButton,
  ListItemButton,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import {Cancel} from "@mui/icons-material";
import {FC, useEffect, useState} from "react";

type FilterProps = {
  label: string;
  value: string;
  source: string;
};

export const FilterListItem: FC<FilterProps> = ({label, value, source}) => {
  const {filterValues, setFilters, displayedFilters} = useListFilterContext();
  const [values, setValues] = useState(filterValues[source] || []);

  useEffect(() => {
    filterValues[source] !== values && setValues(filterValues[source] || []);
  }, [filterValues[source]]);

  const isSelected = () => values.indexOf(value) !== -1;
  const toggleFilter = () => {
    const newFilter = !isSelected()
      ? [...values, value]
      : [...values].filter((el) => el !== value);

    setValues(newFilter);
    setFilters({...filterValues, [source]: newFilter}, displayedFilters);
  };

  return (
    <ListItemButton
      onClick={toggleFilter}
      selected={isSelected()}
      className={FilterListItemClasses.listItemButton}
    >
      <ListItemText
        primary={label}
        className={FilterListItemClasses.listItemText}
      />
      {isSelected() && (
        <ListItemSecondaryAction onClick={toggleFilter}>
          <IconButton size="small">
            <Cancel />
          </IconButton>
        </ListItemSecondaryAction>
      )}
    </ListItemButton>
  );
};
