import {PALETTE_COLORS} from "@/haTheme";
import {styled} from "@mui/material";
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

export function HaMainSearch({source, label}) {
  const {filterValues, setFilters} = useListFilterContext();
  const applyFilter = (event) =>
    setFilters({...filterValues, [source]: event.target.value});

  return (
    <HaMainSearchInput
      data-testid="main-search-filter"
      placeholder={label}
      defaultValue={filterValues[source] || ""}
      onChange={applyFilter}
    />
  );
}
