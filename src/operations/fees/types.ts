import {AdvancedFeesStatistics} from "@haapi-3d601c85/typescript-client";

export type FeeStats = AdvancedFeesStatistics & {
  id: string;
  expired: boolean;
  update_datetime: Date;
};

export type FeeType = "ALL" | "MONTH" | "YEAR" | "RATTRAPAGE" | "ALTERNANT";
export type LevelType = "ALL" | "L1" | "L2" | "L3";

export type FeeRow = {
  label: string;
  type: "MONTH" | "YEAR";
  grade: string;
  dotColor?: string;
  unpaid: number;
  paid: number;
  pending: number;
  late: number;
  total: number;
};

export type RowTotals = {
  unpaid: number;
  paid: number;
  pending: number;
  late: number;
  total: number;
};
