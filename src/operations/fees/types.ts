import {AdvancedFeesStatistics} from "@haapi-b0fc7615/typescript-client";

export type FeeStats = AdvancedFeesStatistics & {
  id: string;
  expired: boolean;
  update_datetime: Date;
};

export type FeeType =
  | "ALL"
  | "MONTH"
  | "YEAR"
  | "RATTRAPAGE"
  | "FRAIS_GENERAUX"
  | "ALTERNANT";

export type FeeCategory = Exclude<FeeType, "ALL">;

export type LevelType = "ALL" | "L1" | "L2" | "L3";

export type FeeGrade = Exclude<LevelType, "ALL">;

export type FeeCounts = {
  unpaid: number;
  paid: number;
  pending: number;
  late: number;
  total: number;
};

export type FeeCountKey = keyof FeeCounts;

export type FeeRow = FeeCounts & {
  label: string;
  category: FeeCategory;
};
