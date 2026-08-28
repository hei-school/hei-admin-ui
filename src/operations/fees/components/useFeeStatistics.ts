import {
  AdvancedFeeStatisticsType,
  FeeStatusEnum,
} from "@haapi-3d601c85/typescript-client";
import {useDataProvider} from "react-admin";

const feeTypeByCardTitle: Record<string, AdvancedFeeStatisticsType> = {
  Accounting: AdvancedFeeStatisticsType.ACCOUNTING,
  Receipt: AdvancedFeeStatisticsType.RECEIPT,
};

const getCurrentMonthRange = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  return {monthFrom: `${y}-${m}`, monthTo: `${y}-${m}`};
};

const getCurrentYearRange = () => {
  const y = new Date().getFullYear();
  return {monthFrom: `${y}-01`, monthTo: `${y}-12`};
};

export const useFeeStatistics = () => {
  const dataProvider = useDataProvider();

  const openStatistics = async (
    cardTitle: string,
    period: "MONTH" | "YEAR"
  ) => {
    const range =
      period === "MONTH" ? getCurrentMonthRange() : getCurrentYearRange();
    const type = feeTypeByCardTitle[cardTitle];

    if (!type) return console.warn("Type de carte inconnu :", cardTitle);

    const {data} = await dataProvider.getList("feeUrlStatistics", {
      pagination: {page: 1, perPage: 1},
      sort: {field: "id", order: "ASC"},
      filter: {...range, status: FeeStatusEnum.PAID, type},
    });

    if (data && data.length > 0) window.open(data[0], "_blank");
  };

  return {openStatistics};
};
