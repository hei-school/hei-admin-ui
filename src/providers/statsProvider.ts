import {formatDateToLocalTimeZone} from "@/utils";
import {
  AdvancedFeesStatistics,
  AdvancedFeeStatisticsType,
  EventStats,
  FeeCategory,
  FeesStatistics,
  FeeStatusEnum,
  FeeTypeEnum,
  MpbsStatus,
  Statistics,
} from "@haapi-b0fc7615/typescript-client";
import {
  HaDataProviderType,
  HaFilter,
  notImplemented,
} from "./HaDataProviderType";
import {eventsApi, payingApi, usersApi} from "./api";
import {MAX_ITEM_PER_PAGE} from "./dataProvider";
import {getMonthFilters} from "./utils";

interface StatsFilter {
  monthFrom?: Date;
  monthTo?: Date;
  viewMode?: AdvancedFeeStatisticsType;
  transaction_status?: MpbsStatus;
  type?: FeeTypeEnum;
  status?: FeeStatusEnum;
  category?: FeeCategory;
  page?: number;
  isMpbs?: boolean;
  student_ref?: string;
}

interface StatsMeta {
  resource?: string;
  filters?: StatsFilter;
}

type Stats = (
  | Statistics
  | AdvancedFeesStatistics
  | FeesStatistics
  | EventStats
) & {id: string};

const statsProvider: HaDataProviderType<
  Stats | undefined,
  HaFilter,
  StatsMeta
> = {
  getList: notImplemented,
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
            filter.category,
            filter.monthFrom,
            filter.monthTo,
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
  saveOrUpdate: notImplemented,
  delete: notImplemented,
};

export default statsProvider;
