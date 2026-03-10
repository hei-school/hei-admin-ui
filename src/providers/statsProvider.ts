import {formatDateToLocalTimeZone} from "@/utils";
import {HaDataProviderType} from "./HaDataProviderType";
import {eventsApi, payingApi, usersApi} from "./api";
import {MAX_ITEM_PER_PAGE} from "./dataProvider";
import {getMonthFilters} from "./utils";

const statsProvider: HaDataProviderType = {
  getList: () => {
    throw new Error("Function not implemented.");
  },
  getOne: async (id: string, meta = {}) => {
    const filter = meta.filters ?? {};
    const {monthFrom, monthTo} = getMonthFilters(filter);

    switch (meta.resource) {
      case "users":
        return usersApi()
          .getStats()
          .then((result) => ({id, ...result.data}));
      case "fees_stats":
        return payingApi()
          .getAdvancedFeesStats(
            formatDateToLocalTimeZone(monthFrom),
            formatDateToLocalTimeZone(monthTo),
            filter.viewMode
          )
          .then((result) => ({id, ...result.data}));
      case "fees":
        return payingApi()
          .getFees(
            filter.transaction_status,
            filter.type,
            filter.status,
            filter.monthFrom,
            filter.monthTo,
            filter.category,
            filter.page ?? 1,
            MAX_ITEM_PER_PAGE,
            filter.isMpbs,
            filter.student_ref
          )
          .then(({data: {statistics}}) => ({id, ...statistics}));
      case "events":
        return eventsApi()
          .getEventStats()
          .then((result) => ({id, ...result.data}));
      default:
        console.error("unknown resource type for getStats");
        return;
    }
  },
  saveOrUpdate: () => {
    throw new Error("Function not implemented.");
  },
  delete: () => {
    throw new Error("Not implemented");
  },
};

export default statsProvider;
