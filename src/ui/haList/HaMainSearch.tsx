import {PALETTE_COLORS} from "@/haTheme";
import {styled} from "@mui/material";
import {ChangeEvent} from "react";
import {useListFilterContext} from "react-admin";

const HaMainSearchInput = styled("input")({
  "outline": "none",
  "border": "none",
  "fontSize": "14px",
  "width": "200px",
  "color": "#48494a",
  "marginLeft": "10px",
  "backgroundColor": PALETTE_COLORS.bgGrey,
  "&::placeholder": {
    color: "#666967",
    opacity: 0.8,
  },
});

export interface HaMainSearchProps {
  source: string;
  label: string;
}

export const HaMainSearch = ({source, label}: Readonly<HaMainSearchProps>) => {
  const {filterValues, setFilters} = useListFilterContext();
  const applyFilter = (event: ChangeEvent<HTMLInputElement>) =>
    setFilters({...filterValues, [source]: event.target.value}, undefined);

  return (
    <HaMainSearchInput
      data-testid="main-search-filter"
      placeholder={label}
      defaultValue={filterValues[source] || ""}
      onChange={applyFilter}
    />
  );
};
