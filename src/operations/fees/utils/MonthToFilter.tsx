import {DateTimeFilter} from "@/ui/haToolbar";
import useHaToolbarContext from "@/ui/haToolbar/useHaToolbarContext";
import {useEffect} from "react";

export const MonthToFilter = () => {
  const {currentFilter, setOneFilter} = useHaToolbarContext();
  const {monthFrom} = currentFilter;
  const date = new Date(monthFrom);

  useEffect(() => {
    setOneFilter(
      "monthTo",
      new Date(date.getFullYear(), date.getMonth() + 1, 0)?.toISOString()
    );
  }, [monthFrom]);

  return (
    <DateTimeFilter
      format="MM/YYYY"
      view={["month", "year"]}
      label="Fin"
      source="monthTo"
      value={currentFilter?.monthFrom}
      disabled
    />
  );
};
