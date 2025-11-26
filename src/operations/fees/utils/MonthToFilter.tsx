import {DateTimeFilter} from "@/ui/haToolbar";
import useHaToolbarContext from "@/ui/haToolbar/useHaToolbarContext";
import {useEffect} from "react";

export const MonthToFilter = () => {
  const {currentFilter, setOneFilter} = useHaToolbarContext();
  const {monthFrom} = currentFilter;

  useEffect(() => {
    if (monthFrom) {
      const date = new Date(monthFrom);
      if (!isNaN(date.getTime())) {
        setOneFilter(
          "monthTo",
          new Date(date.getFullYear(), date.getMonth() + 1, 0)?.toISOString()
        );
      }
    }
  }, [monthFrom, setOneFilter]);

  return (
    <DateTimeFilter
      format="MM/YYYY"
      view={["month", "year"]}
      label="Fin"
      source="to"
      value={currentFilter?.monthTo}
      disabled
    />
  );
};
