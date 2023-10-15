import { FilterListItemClasses, useListFilterContext } from "react-admin";
import {
  IconButton,
  ListItemButton,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { Cancel } from '@mui/icons-material'

export const FilterListItem = ({ label, value, type}) => {
  const { filterValues, setFilters } = useListFilterContext();
  const isSelected = ()=> {
    if(filterValues[type]){
      return filterValues[type].indexOf(value) !== -1
    }
    return false;
  }
  const addFilter = () => {
    setFilters({...filterValues, [type]: [...filterValues[type] || [], value]})
  }
  const removeFilter = () => {
    const newValue = [...filterValues[type] || []].filter(el => el !== value)
    setFilters({...filterValues, [type]: newValue});
  }
  const toggleFilter = () => (isSelected() ? removeFilter() : addFilter());

    return (
      <ListItemButton onClick={toggleFilter} selected={isSelected()} className={ FilterListItemClasses.listItemButton } >
        <ListItemText primary={label} className={FilterListItemClasses.listItemText} />
        {isSelected() && (
          <ListItemSecondaryAction onClick={toggleFilter}>
            <IconButton size='small'>
              <Cancel />
            </IconButton>
          </ListItemSecondaryAction>
        )}
      </ListItemButton>
    );
}

export default FilterListItem 
