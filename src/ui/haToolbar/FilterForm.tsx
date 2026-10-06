import {FilterList} from "@mui/icons-material";
import {SxProps, Theme} from "@mui/material";
import {ReactNode, createContext, useCallback, useMemo, useState} from "react";
import {useListFilterContext} from "react-admin";
import useHaListContext from "../haList/useHaListContext";
import {ButtonBase} from "../haToolbar";
import {FilterContentResponsive} from "./FilterFormContent";
import {HaToolbarContextValue, HaToolbarFilter} from "./useHaToolbarContext";

export const HaToolbarContext = createContext<
  Partial<HaToolbarContextValue<HaToolbarFilter>>
>({});

interface FilterFormProps {
  children?: ReactNode;
}

export const FilterForm = ({children}: Readonly<FilterFormProps>) => {
  const {filterValues, setFilters} = useListFilterContext();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const {closeAction} = useHaListContext();
  const [currentFilter, setCurrentFilter] =
    useState<HaToolbarFilter>(filterValues);

  const submitChange = () => setFilters(currentFilter, undefined);
  const setOneFilter = useCallback(
    (source: string, values: unknown) =>
      setCurrentFilter((prev) => ({...prev, [source]: values})),
    []
  );
  const toolbarContextValue = useMemo(
    () => ({setCurrentFilter, currentFilter, setOneFilter}),
    [currentFilter, setOneFilter]
  );
  const isFilterApplied = Object.keys(filterValues || {}).length > 0;

  const handleCloseFilter = (hasChanged: boolean) => {
    setAnchorEl(null);
    closeAction();
    if (!hasChanged) {
      setCurrentFilter(filterValues);
    }
  };

  const indicator: SxProps<Theme> = {
    "position": "relative",
    "::after": {
      content: '""',
      display: "block",
      width: "7px",
      position: "absolute",
      height: "7px",
      bgcolor: "blue",
      top: "5px",
      borderRadius: "50%",
      right: "5px",
    },
  };

  return (
    <HaToolbarContext.Provider value={toolbarContextValue}>
      <ButtonBase
        label="Filtres"
        icon={<FilterList />}
        data-testid="add-filter"
        closeAction={false}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={isFilterApplied ? indicator : undefined}
      />
      <FilterContentResponsive
        anchorEl={anchorEl}
        onClose={handleCloseFilter}
        onSubmit={submitChange}
      >
        {children}
      </FilterContentResponsive>
    </HaToolbarContext.Provider>
  );
};
